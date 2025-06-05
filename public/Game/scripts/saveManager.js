let VERSION = '1.0.0';
try {
  let data = null;
  try {
    const url = new URL('../../schema.json', import.meta.url);
    const res = await fetch(url);
    if (res.ok) {
      data = await res.json();
    }
  } catch { /* fetch may fail in non-browser environment */ }

  if (!data) {
    const { readFileSync } = await import('fs');
    const { dirname, join } = await import('path');
    const { fileURLToPath } = await import('url');
    const root = dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url)))));
    const schemaPath = join(root, 'schema.json');
    data = JSON.parse(readFileSync(schemaPath, 'utf8'));
  }
  if (data && data.schemaVersion) {
    VERSION = data.schemaVersion;
  }
} catch (err) {
  console.log('Could not load schema.json:', err.message);
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
