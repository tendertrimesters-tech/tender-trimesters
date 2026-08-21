/**
 * IndexedDB-based audio storage for meditation recordings.
 * Each meditation can have one user-uploaded audio file (mp3, wav, m4a, etc.)
 * stored as a Blob. TTS remains the fallback.
 */

const DB_NAME = "tender-trimesters-audio";
const DB_VERSION = 1;
const STORE_NAME = "meditation-audio";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "meditationId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Save an audio blob for a meditation */
export async function saveMeditationAudio(
  meditationId: string,
  audioBlob: Blob,
  fileName: string
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put({
      meditationId,
      audioBlob,
      fileName,
      savedAt: new Date().toISOString(),
      sizeBytes: audioBlob.size,
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Get the audio blob for a meditation (null if none uploaded) */
export async function getMeditationAudio(
  meditationId: string
): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(meditationId);
    request.onsuccess = () => {
      const record = request.result as
        | { audioBlob: Blob; fileName: string; savedAt: string; sizeBytes: number }
        | undefined;
      resolve(record?.audioBlob ?? null);
    };
    request.onerror = () => reject(request.error);
  });
}

/** Get metadata for a meditation recording (without the blob) */
export async function getMeditationAudioMeta(
  meditationId: string
): Promise<{ fileName: string; savedAt: string; sizeBytes: number } | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(meditationId);
    request.onsuccess = () => {
      const record = request.result as
        | { audioBlob: Blob; fileName: string; savedAt: string; sizeBytes: number }
        | undefined;
      if (!record) {
        resolve(null);
        return;
      }
      // Return metadata without the heavy blob
      resolve({
        fileName: record.fileName,
        savedAt: record.savedAt,
        sizeBytes: record.sizeBytes,
      });
    };
    request.onerror = () => reject(request.error);
  });
}

/** Delete the audio for a meditation */
export async function deleteMeditationAudio(
  meditationId: string
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(meditationId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Check if a meditation has an uploaded recording */
export async function hasMeditationAudio(
  meditationId: string
): Promise<boolean> {
  const meta = await getMeditationAudioMeta(meditationId);
  return meta !== null;
}

/** Format bytes to human-readable size */
export function formatAudioSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
