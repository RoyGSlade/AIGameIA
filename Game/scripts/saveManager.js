import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let VERSION = '1.0.0';
try {
  const path = join(dirname(fileURLToPath(import.meta.url)), '../../schema.json');
  const data = JSON.parse(readFileSync(path, 'utf8'));
  VERSION = data.schemaVersion;
} catch {
  // Browser environment will fallback to this default
}

const STORAGE_KEY = 'currentCharacter';

export function saveCharacter(data) {
  const payload = { version: VERSION, character: data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadCharacter() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const payload = JSON.parse(raw);
    if (payload.version !== VERSION) {
      return migrateCharacter(payload);
    }
    return payload.character;
  } catch {
    return null;
  }
}

function migrateCharacter(payload) {
  // Placeholder for future version migrations
  return payload.character;
}

export function clearSavedCharacter() {
  localStorage.removeItem(STORAGE_KEY);
}
