// Base path for all character creation JSON files.
// Using a root-relative HTTP path ensures fetch() works when assets
// are served via the Express/static server.
const CHARACTER_CREATION_BASE = '/Game/data/character-creation/';

export function getCharacterCreationBase() {
  return CHARACTER_CREATION_BASE;
}

export function resolveCharacterCreationPath(fileName) {
  return `${CHARACTER_CREATION_BASE}${fileName}`;
}

export async function fetchJsonFile(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.log(`Failed to load ${path}: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.log(`Error loading ${path}: ${error.message}`);
    try {
      // Build a file path relative to this script for Node environments.
      const modulePath = new URL('..' + path.replace('/Game', ''), import.meta.url).href;
      // Support both import assertion and the newer `with` syntax
      try {
        const module = await import(modulePath, { with: { type: 'json' } });
        return module.default;
      } catch {
        const module = await import(modulePath, { assert: { type: 'json' } });
        return module.default;
      }
    } catch (importError) {
      console.log(`Import fallback failed for ${path}: ${importError.message}`);
      return null;
    }
  }
}
