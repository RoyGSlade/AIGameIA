// Base path for all character creation JSON files. The path is
// resolved relative to this script so it works whether the page is
// served via HTTP or opened directly from the filesystem.
// Updated path uses a hyphen to avoid issues with spaces in URLs
const CHARACTER_CREATION_BASE = new URL('../data/character-creation/', import.meta.url);

export function getCharacterCreationBase() {
  return CHARACTER_CREATION_BASE.href;
}

export function resolveCharacterCreationPath(fileName) {
  return new URL(fileName, CHARACTER_CREATION_BASE).href;
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
      const modulePath = new URL(path, import.meta.url).href;
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
