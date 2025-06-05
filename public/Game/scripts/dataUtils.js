// Base path for all character creation JSON files. The path is
// resolved relative to this script so it works whether the page is
// served via HTTP or opened directly from the filesystem.
const CHARACTER_CREATION_BASE = new URL('../data/character creation/', import.meta.url);

export function getCharacterCreationBase() {
  return CHARACTER_CREATION_BASE.href;
}

export function resolveCharacterCreationPath(fileName) {
  return new URL(fileName, CHARACTER_CREATION_BASE).href;
}

export async function fetchJsonFile(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      console.log(`Failed to load ${path}: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.log(`Error loading ${path}: ${err.message}`);
    try {
      const modulePath = new URL(path, import.meta.url).href;
      const mod = await import(modulePath, { assert: { type: 'json' } });
      return mod.default;
    } catch (importErr) {
      console.log(`Import fallback failed for ${path}: ${importErr.message}`);
      return null;
    }
  }
}
