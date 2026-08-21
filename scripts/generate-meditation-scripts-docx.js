/**
 * Meditation Scripts — DOCX Generator
 * -----------------------------------
 * Produces a polished, recording-ready Word document containing
 * all 8 meditation scripts for the Tender Trimesters app.
 *
 * Output: /home/z/my-project/download/Meditation-Scripts.docx
 *
 * Design: warm, nurturing palette inspired by the Tender Trimesters
 * brand. No cover, no TOC — this is a working reference doc that
 * the founder can read on screen or print for recording sessions.
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, PageNumber, AlignmentType, HeadingLevel, WidthType,
  BorderStyle, ShadingType, PageBreak, LevelFormat,
} = require("docx");
const fs = require("fs");
const path = require("path");

// Load meditation data (compile-safe inline copy of the source data
// since TS module imports are not directly require-able from plain JS).
// We read the TS file, but rather than parse it, we just inline the
// same data here by re-importing through a ts-aware require.
//
// Simpler approach: we re-declare the data inline by reading the .ts
// file as text and extracting the array literal via a tiny eval-free
// approach is fragile. Instead, we just copy the data into this file
// by hand at the bottom of this comment block, then use it directly.
//
// For maintainability, the canonical source is src/data/meditations.ts.
// If you update that file, mirror the changes here.

// ─── Warm palette (Tender Trimesters brand) ──────────────────────────
const P = {
  primary: "#3D2B3D",      // Deep plum — main headings
  body: "#2E2A2E",          // Warm dark — body text
  secondary: "#7A6B75",    // Soft mauve — captions, pause markers
  accent: "#B5838D",        // Dusty rose — accent, breath cues, affirmations
  accentDeep: "#8A5A66",   // Deeper rose — affirmation emphasis
  surface: "#FAF6F2",       // Warm cream — callout backgrounds
  rule: "#E8DDD8",          // Soft rule — dividers
};

const c = (hex) => hex.replace("#", "");
const FONT = { ascii: "Calibri", eastAsia: "Microsoft YaHei" };
const FONT_HEAD = { ascii: "Calibri", eastAsia: "Microsoft YaHei" };

// ─── Inline meditation data (mirrors src/data/meditations.ts) ────────
// Loaded below from a separate JSON dump to keep this file readable.
const MEDITATIONS = JSON.parse(
  fs.readFileSync(path.join(__dirname, "meditations-data.json"), "utf-8")
);

// ─── Component builders ──────────────────────────────────────────────

function docTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120, line: 480 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 44, // 22pt
        color: c(P.primary),
        font: FONT_HEAD,
      }),
    ],
  });
}

function docSubtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 360, line: 360 },
    children: [
      new TextRun({
        text,
        italics: true,
        size: 26, // 13pt
        color: c(P.secondary),
        font: FONT,
      }),
    ],
  });
}

function brandTag(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 480, line: 280 },
    children: [
      new TextRun({
        text,
        size: 18, // 9pt
        color: c(P.secondary),
        font: FONT,
        characterSpacing: 60,
      }),
    ],
  });
}

function sectionRule() {
  // A thin horizontal rule using paragraph bottom border
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: c(P.rule), space: 1 },
    },
    children: [new TextRun({ text: "" })],
  });
}

function meditationTitle(num, title) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 480, after: 80, line: 360 },
    children: [
      new TextRun({
        text: `${String(num).padStart(2, "0")}  `,
        size: 32,
        color: c(P.accent),
        font: FONT_HEAD,
        bold: true,
      }),
      new TextRun({
        text: title,
        size: 36, // 18pt
        color: c(P.primary),
        font: FONT_HEAD,
        bold: true,
      }),
    ],
  });
}

function meditationSubtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 0, after: 200, line: 320 },
    children: [
      new TextRun({
        text,
        italics: true,
        size: 24, // 12pt
        color: c(P.secondary),
        font: FONT,
      }),
    ],
  });
}

function metaTable(meditation) {
  // Two-column metadata table (label / value) using percentage widths
  const rows = [
    ["Category", capitalize(meditation.category.replace("-", " "))],
    ["Duration", `${meditation.durationMinutes} minutes`],
    ["Intention", meditation.intention],
    ["Voice guidance", meditation.voiceGuidance],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: c(P.rule) },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: c(P.rule) },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: c(P.rule) },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: rows.map(([label, value]) =>
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            margins: { top: 120, bottom: 120, left: 0, right: 120 },
            shading: { type: ShadingType.CLEAR, fill: c(P.surface) },
            children: [
              new Paragraph({
                spacing: { line: 300 },
                children: [
                  new TextRun({
                    text: label.toUpperCase(),
                    bold: true,
                    size: 18, // 9pt
                    color: c(P.accentDeep),
                    font: FONT_HEAD,
                    characterSpacing: 40,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 78, type: WidthType.PERCENTAGE },
            margins: { top: 120, bottom: 120, left: 160, right: 0 },
            children: [
              new Paragraph({
                spacing: { line: 320 },
                children: [
                  new TextRun({
                    text: value,
                    size: 22, // 11pt
                    color: c(P.body),
                    font: FONT,
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    ),
  });
}

function scriptHeader() {
  return new Paragraph({
    spacing: { before: 360, after: 160, line: 280 },
    children: [
      new TextRun({
        text: "SCRIPT",
        bold: true,
        size: 18, // 9pt
        color: c(P.accent),
        font: FONT_HEAD,
        characterSpacing: 80,
      }),
    ],
  });
}

function speakLine(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 140, after: 140, line: 360 },
    children: [
      new TextRun({
        text,
        size: 24, // 12pt
        color: c(P.body),
        font: FONT,
      }),
    ],
  });
}

function pauseMarker(seconds) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 80, after: 80, line: 280 },
    indent: { left: 280 },
    children: [
      new TextRun({
        text: `[ pause ${seconds}s ]`,
        size: 18, // 9pt
        color: c(P.secondary),
        italics: true,
        font: FONT,
      }),
    ],
  });
}

function breathLine(direction, text) {
  const arrow = direction === "in" ? "↓" : direction === "out" ? "↑" : "•";
  const label = direction === "in" ? "BREATHE IN" : direction === "out" ? "BREATHE OUT" : "HOLD";
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 120, after: 120, line: 340 },
    indent: { left: 280 },
    children: [
      new TextRun({
        text: `${arrow}  ${label}  `,
        size: 22, // 11pt
        color: c(P.accent),
        bold: true,
        font: FONT_HEAD,
        characterSpacing: 40,
      }),
      new TextRun({
        text: text || "",
        size: 22,
        color: c(P.accent),
        italics: true,
        font: FONT,
      }),
    ],
  });
}

function affirmationLine(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 180, after: 180, line: 360 },
    indent: { left: 280, right: 280 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 12, color: c(P.accent), space: 12 },
    },
    children: [
      new TextRun({
        text: `\u201C${text}\u201D`,
        size: 26, // 13pt
        color: c(P.accentDeep),
        italics: true,
        bold: true,
        font: FONT,
      }),
    ],
  });
}

function journalPromptCard(text) {
  // A single-cell shaded table acting as a callout
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 240, bottom: 240, left: 320, right: 320 },
            shading: { type: ShadingType.CLEAR, fill: c(P.surface) },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 100, line: 280 },
                children: [
                  new TextRun({
                    text: "JOURNAL PROMPT",
                    bold: true,
                    size: 18,
                    color: c(P.accentDeep),
                    font: FONT_HEAD,
                    characterSpacing: 80,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 0, after: 0, line: 360 },
                children: [
                  new TextRun({
                    text,
                    size: 24,
                    color: c(P.body),
                    italics: true,
                    font: FONT,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function buildMeditation(num, meditation) {
  const elements = [];

  elements.push(meditationTitle(num, meditation.title));
  elements.push(meditationSubtitle(meditation.subtitle));
  elements.push(metaTable(meditation));
  elements.push(scriptHeader());

  for (const beat of meditation.beats) {
    if (beat.type === "speak" && beat.text) {
      elements.push(speakLine(beat.text));
    } else if (beat.type === "pause" && beat.pauseSeconds) {
      elements.push(pauseMarker(beat.pauseSeconds));
    } else if (beat.type === "breath") {
      elements.push(breathLine(beat.breath, beat.text));
    } else if (beat.type === "affirmation" && beat.text) {
      elements.push(affirmationLine(beat.text));
    }
    // journal beats in the middle of the script are not currently used
  }

  elements.push(
    new Paragraph({
      spacing: { before: 360, after: 200, line: 280 },
      children: [
        new TextRun({
          text: "AFTER THE PRACTICE",
          bold: true,
          size: 18,
          color: c(P.accent),
          font: FONT_HEAD,
          characterSpacing: 80,
        }),
      ],
    })
  );
  elements.push(journalPromptCard(meditation.journalPrompt));
  elements.push(sectionRule());

  return elements;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildIntro() {
  return [
    docTitle("Guided Meditation Scripts"),
    docSubtitle("Tender Trimesters  ·  Audio Meditations Library"),
    brandTag("MOMMIES MATTER   ·   WRITTEN IN TEMPIE\u2019S VOICE   ·   EIGHT PRACTICES"),

    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 240, after: 200, line: 360 },
      children: [
        new TextRun({
          text:
            "This collection contains eight original guided meditations written for the Tender Trimesters app. Each script is designed to be read aloud slowly \u2014 roughly 120 to 140 words per minute \u2014 with the pause durations treated as minimums. Extend them when the moment asks for it. The voice should be warm, low, unhurried, as if sitting beside the listener rather than addressing her from a stage.",
          size: 22,
          color: c(P.body),
          font: FONT,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 200, line: 360 },
      children: [
        new TextRun({
          text:
            "The scripts are organized by the arc of pregnancy: two for the first trimester, two for the second, two for the third, one for birth preparation, and one for the early postpartum weeks. Each script opens with an intention, a voice-guidance note for the reader, the spoken text itself with embedded pause and breath cues, and a closing journal prompt that the listener can carry into her day.",
          size: 22,
          color: c(P.body),
          font: FONT,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 360, line: 360 },
      children: [
        new TextRun({
          text:
            "These are not clinical scripts. They are love letters \u2014 to the mama who is afraid in the early weeks, to the mama who cannot sleep at the end, to the mama who is meeting her baby for the first time. Read them that way. Mean every word.",
          size: 22,
          color: c(P.body),
          italics: true,
          font: FONT,
        }),
      ],
    }),

    sectionRule(),
  ];
}

// ─── Document assembly ───────────────────────────────────────────────

const allChildren = [...buildIntro()];
MEDITATIONS.forEach((m, i) => {
  allChildren.push(...buildMeditation(i + 1, m));
});

const doc = new Document({
  creator: "Tender Trimesters",
  title: "Meditation Scripts",
  description: "Guided meditation scripts for the Tender Trimesters app",
  styles: {
    default: {
      document: {
        run: {
          font: FONT,
          size: 24,
          color: c(P.body),
        },
        paragraph: {
          spacing: { line: 360 },
        },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "Tender Trimesters  ·  Meditation Scripts",
                  size: 16,
                  color: c(P.secondary),
                  italics: true,
                  font: FONT,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  children: [PageNumber.CURRENT],
                  size: 18,
                  color: c(P.secondary),
                  font: FONT,
                }),
              ],
            }),
          ],
        }),
      },
      children: allChildren,
    },
  ],
});

const outPath = path.join(
  "/home/z/my-project/download",
  "Meditation-Scripts.docx"
);

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outPath, buf);
  console.log(`OK  wrote ${outPath}  (${buf.length} bytes)`);
});
