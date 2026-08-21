// Generate TTS audio for all 8 Tender Trimesters meditation scripts.
//
// Workflow:
//   1. Parse meditation-scripts.md into 8 meditation objects {title, category, body}
//   2. For each meditation, split body into <1000-char chunks at sentence boundaries
//   3. Generate MP3 for each chunk via z-ai-web-dev-sdk (voice: tongtong, speed: 0.85)
//   4. Generate 2-second silence MP3 once (reused as the gap between chunks)
//   5. Concatenate chunks + gaps using ffmpeg into a single meditation-NN.mp3 file
//   6. Print a summary table at the end
//
// Files written to /home/z/my-project/download/meditations/
//   - meditation-01-welcome-little-one.mp3
//   - meditation-02-through-the-wave.mp3
//   - meditation-03-the-glow-returns.mp3
//   - meditation-04-strong-enough.mp3
//   - meditation-05-opening.mp3
//   - meditation-06-rest-now-mama.mp3
//   - meditation-07-this-too.mp3
//   - meditation-08-you-did-it-mama.mp3

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const SCRIPTS_PATH = "/home/z/my-project/download/meditations/meditation-scripts.md";
const OUT_DIR = "/home/z/my-project/download/meditations";
const TMP_DIR = "/home/z/my-project/scripts/.tts-tmp";

const VOICE = "tongtong"; // warm, intimate — best match for mama tone
const SPEED = 0.85; // meditation pace (slower than normal, not too slow)
const GAP_SECONDS = 2; // silence between chunks

// Slugify a meditation title into a filename-safe slug.
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// Parse the markdown file into meditation objects.
// Each meditation starts with "## Meditation N: Title (Category)" header.
function parseScripts(md: string): Array<{
  number: number;
  title: string;
  category: string;
  body: string;
}> {
  const lines = md.split("\n");
  const meditations: Array<{
    number: number;
    title: string;
    category: string;
    body: string;
  }> = [];
  let current: { number: number; title: string; category: string; bodyLines: string[] } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(/^## Meditation\s+(\d+):\s*(.+?)\s*\((.+?)\)\s*$/);
    if (headerMatch) {
      if (current) {
        meditations.push({
          number: current.number,
          title: current.title,
          category: current.category,
          body: current.bodyLines.join("\n").trim(),
        });
      }
      current = {
        number: parseInt(headerMatch[1], 10),
        title: headerMatch[2].trim(),
        category: headerMatch[3].trim(),
        bodyLines: [],
      };
      // Skip the metadata block that follows the header (Duration, Use case, Category lines)
      // until we hit the first --- separator.
      while (i < lines.length - 1 && lines[i + 1].trim() !== "---") {
        i++;
      }
      // Skip the --- separator itself
      i++;
      continue;
    }
    if (current) {
      // Stop collecting body when we hit the next ## Meditation header or end of file
      if (line.startsWith("## Meditation")) {
        // shouldn't happen due to continue above, but safety
        meditations.push({
          number: current.number,
          title: current.title,
          category: current.category,
          body: current.bodyLines.join("\n").trim(),
        });
        current = null;
        i--; // reprocess this line
        continue;
      }
      current.bodyLines.push(line);
    }
  }
  if (current) {
    meditations.push({
      number: current.number,
      title: current.title,
      category: current.category,
      body: current.bodyLines.join("\n").trim(),
    });
  }
  return meditations;
}

// Split text into chunks of <= maxLength characters, breaking at sentence boundaries.
function splitIntoChunks(text: string, maxLength = 900): string[] {
  // First, normalize: collapse triple+ newlines into paragraph breaks,
  // strip markdown formatting (---, **, etc.)
  const cleaned = text
    .replace(/^---\s*$/gm, "\n\n") // convert section separators to paragraph breaks
    .replace(/\*\*(.+?)\*\*/g, "$1") // strip bold
    .replace(/\*(.+?)\*/g, "$1") // strip italic
    .replace(/[""]/g, '"') // smart quotes to straight
    .replace(/['']/g, "'")
    .replace(/\u2014/g, "—") // em dash (keep)
    .replace(/\u2013/g, "–") // en dash (keep)
    .replace(/\s+/g, " ")
    .trim();

  // Split into sentences. We treat ., !, ? followed by space as sentence end.
  // Also split on em-dashes that introduce long pauses.
  const sentences = cleaned.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) || [cleaned];

  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    const s = sentence.trim();
    if (!s) continue;
    if ((current + " " + s).length <= maxLength) {
      current = current ? current + " " + s : s;
    } else {
      if (current) chunks.push(current);
      // If a single sentence is longer than maxLength, hard-split it.
      if (s.length > maxLength) {
        for (let i = 0; i < s.length; i += maxLength) {
          chunks.push(s.slice(i, i + maxLength));
        }
        current = "";
      } else {
        current = s;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function generateChunk(
  zai: ZAI,
  text: string,
  outputPath: string
): Promise<void> {
  // Note: the API only supports wav/pcm (mp3 returns 400). We generate WAV
  // and let ffmpeg convert to MP3 during final concatenation.
  // Retry on 429 (rate limit) with conservative exponential backoff.
  // Hard 60s timeout per call so a hung request can't block forever.
  const maxRetries = 8;
  const callTimeoutMs = 60000;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Race the API call against a timeout — if it doesn't respond in 60s,
      // treat it like a 429 and retry with backoff.
      const response = await Promise.race([
        zai.audio.tts.create({
          input: text,
          voice: VOICE,
          speed: SPEED,
          response_format: "wav",
          stream: false,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("TTS call timed out after 60s")), callTimeoutMs)
        ),
      ]);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(new Uint8Array(arrayBuffer));
      fs.writeFileSync(outputPath, buffer);
      return;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const is429 = msg.includes("429") || msg.toLowerCase().includes("too many") || msg.includes("timed out");
      if (!is429 || attempt === maxRetries - 1) throw err;
      // Conservative backoff: 10s, 20s, 30s, 40s, 50s, 60s, 60s
      const backoffMs = Math.min(10000 * (attempt + 1), 60000);
      console.log(`\n     [retry ${attempt + 1}/${maxRetries} in ${backoffMs / 1000}s: ${msg.slice(0, 80)}]`);
      await new Promise((r) => setTimeout(r, backoffMs));
    }
  }
}

// Generate a silent WAV of given duration using ffmpeg.
function generateSilence(outputPath: string, seconds: number): void {
  execSync(
    `ffmpeg -y -f lavfi -i anullsrc=channel_layout=mono:sample_rate=24000 -t ${seconds} -c:a pcm_s16le "${outputPath}" 2>/dev/null`,
    { stdio: "pipe" }
  );
}

// Concatenate audio files using ffmpeg concat demuxer, output as MP3.
// Inputs may be WAV (from TTS) or WAV (silence) — all same format.
// We write a list file and pass it to ffmpeg -f concat, then encode to MP3.
function concatenateMp3s(inputFiles: string[], outputPath: string): void {
  const listFile = `${outputPath}.list.txt`;
  const listContent = inputFiles.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join("\n");
  fs.writeFileSync(listFile, listContent);
  try {
    // -f concat demuxer reads the list, then we re-encode to MP3.
    // (concat demuxer with same codec would be faster but requires identical
    // stream params across inputs; re-encoding is safer.)
    execSync(
      `ffmpeg -y -f concat -safe 0 -i "${listFile}" -c:a libmp3lame -b:a 96k -ar 24000 "${outputPath}" 2>/dev/null`,
      { stdio: "pipe" }
    );
  } finally {
    fs.unlinkSync(listFile);
  }
}

async function main() {
  console.log("=== Tender Trimesters — Meditation TTS Generator ===\n");

  // Setup directories
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  if (fs.existsSync(TMP_DIR)) fs.rmSync(TMP_DIR, { recursive: true, force: true });
  fs.mkdirSync(TMP_DIR, { recursive: true });

  // Read & parse scripts
  const md = fs.readFileSync(SCRIPTS_PATH, "utf8");
  const meditations = parseScripts(md);
  console.log(`Parsed ${meditations.length} meditations from scripts file.\n`);

  if (meditations.length === 0) {
    console.error("ERROR: No meditations parsed. Check the markdown format.");
    process.exit(1);
  }

  // Generate silence gap file (reused for all meditations) — WAV format
  const silencePath = path.join(TMP_DIR, "silence.wav");
  console.log(`Generating ${GAP_SECONDS}s silence gap...`);
  generateSilence(silencePath, GAP_SECONDS);
  console.log();

  // Init ZAI SDK
  const zai = await ZAI.create();

  const summary: Array<{
    num: number;
    title: string;
    category: string;
    chunks: number;
    charCount: number;
    outPath: string;
    sizeBytes: number;
  }> = [];

  for (const med of meditations) {
    const slug = slugify(med.title);
    const filename = `meditation-${String(med.number).padStart(2, "0")}-${slug}.mp3`;
    const outPath = path.join(OUT_DIR, filename);

    // Resume capability: skip if the final MP3 already exists.
    if (fs.existsSync(outPath)) {
      const stats = fs.statSync(outPath);
      console.log(`[${med.number}/8] "${med.title}" — already exists, skipping (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      summary.push({
        num: med.number,
        title: med.title,
        category: med.category,
        chunks: 0,
        charCount: med.body.length,
        outPath,
        sizeBytes: stats.size,
      });
      continue;
    }

    console.log(`[${med.number}/8] "${med.title}" (${med.category})`);

    const chunks = splitIntoChunks(med.body, 900);
    console.log(`  → ${chunks.length} chunks, ${med.body.length} chars total`);

    // Track chunk paths with their index so we can sort before concatenation
    // (in case retries appended out of order).
    const chunkFiles: Array<{ index: number; path: string }> = [];
    const failedChunks: Array<{ index: number; path: string; text: string }> = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunkPath = path.join(TMP_DIR, `med${med.number}-chunk${String(i).padStart(3, "0")}.wav`);
      // Resume capability: if chunk file already exists from a previous run, reuse it.
      if (fs.existsSync(chunkPath)) {
        console.log(`  → chunk ${i + 1}/${chunks.length} (cached)`);
        chunkFiles.push({ index: i, path: chunkPath });
        continue;
      }
      process.stdout.write(`  → chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)... `);
      try {
        await generateChunk(zai, chunks[i], chunkPath);
        chunkFiles.push({ index: i, path: chunkPath });
        console.log("ok");
      } catch (err) {
        console.log("FAILED — skipping, will retry at end");
        console.error(`     Error: ${err instanceof Error ? err.message : err}`);
        // Don't throw — record the failed chunk index for retry at end of meditation
        failedChunks.push({ index: i, path: chunkPath, text: chunks[i] });
      }
      // Polite delay between chunks to avoid rate limits.
      // 3s base delay — the API rate limits aggressively.
      await new Promise((r) => setTimeout(r, 3000));
    }

    // Retry any failed chunks for this meditation before concatenating.
    if (failedChunks.length > 0) {
      console.log(`  → retrying ${failedChunks.length} failed chunk(s) with longer delays...`);
      const stillFailed: typeof failedChunks = [];
      for (const fc of failedChunks) {
        process.stdout.write(`  → retry chunk ${fc.index + 1}... `);
        try {
          // 10s cooldown before each retry
          await new Promise((r) => setTimeout(r, 10000));
          await generateChunk(zai, fc.text, fc.path);
          chunkFiles.push({ index: fc.index, path: fc.path });
          console.log("ok");
        } catch (err) {
          console.log("STILL FAILED");
          console.error(`     Error: ${err instanceof Error ? err.message : err}`);
          stillFailed.push(fc);
        }
      }
      if (stillFailed.length > 0) {
        console.error(`\n  ⚠ ${stillFailed.length} chunk(s) could not be generated. Meditation will be incomplete.`);
        // Filter chunkFiles to only those that exist on disk (in case of failures)
        // and sort by index for proper ordering.
      }
    }

    // Filter out any chunk paths that don't exist on disk (failed retries),
    // sort by index for proper order, then build the interleaved list.
    const sortedChunks = chunkFiles
      .filter((c) => fs.existsSync(c.path))
      .sort((a, b) => a.index - b.index)
      .map((c) => c.path);

    if (sortedChunks.length === 0) {
      console.error(`  ⚠ No chunks generated for meditation ${med.number}. Skipping.`);
      continue;
    }

    // Interleave chunks with silence gaps.
    // Pattern: chunk1, silence, chunk2, silence, chunk3, ... (no trailing silence)
    const interleaved: string[] = [];
    for (let i = 0; i < sortedChunks.length; i++) {
      interleaved.push(sortedChunks[i]);
      if (i < sortedChunks.length - 1) interleaved.push(silencePath);
    }

    console.log(`  → concatenating ${interleaved.length} segments...`);
    concatenateMp3s(interleaved, outPath);
    const stats = fs.statSync(outPath);
    console.log(`  → saved: ${outPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)\n`);

    summary.push({
      num: med.number,
      title: med.title,
      category: med.category,
      chunks: chunks.length,
      charCount: med.body.length,
      outPath,
      sizeBytes: stats.size,
    });
  }

  // Cleanup tmp dir
  fs.rmSync(TMP_DIR, { recursive: true, force: true });

  // Print summary table
  console.log("\n=== Generation Complete ===\n");
  console.log(
    `${"#".padStart(2)}  ${"Title".padEnd(35)}  ${"Category".padEnd(20)}  ${"Chunks".padStart(6)}  ${"Size (MB)".padStart(10)}`
  );
  console.log("-".repeat(85));
  for (const s of summary) {
    console.log(
      `${String(s.num).padStart(2)}  ${s.title.slice(0, 35).padEnd(35)}  ${s.category.slice(0, 20).padEnd(20)}  ${String(s.chunks).padStart(6)}  ${(s.sizeBytes / 1024 / 1024).toFixed(2).padStart(10)}`
    );
  }
  const totalSize = summary.reduce((a, s) => a + s.sizeBytes, 0);
  console.log("-".repeat(85));
  console.log(`Total: ${summary.length} meditations, ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((err) => {
  console.error("\nFATAL:", err);
  process.exit(1);
});
