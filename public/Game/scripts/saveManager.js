let VERSION = '1.0.0';
try {
  const url = new URL('../../schema.json', import.meta.url);
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();
    VERSION = data.schemaVersion;
  }
} catch {
  // Browser or test environment may fail to load schema; default remains
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
