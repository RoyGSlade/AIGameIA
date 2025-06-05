// Root path for all character creation JSON data. Using a fixed
// absolute path avoids issues when the page is served from different
// directories or nested routes.
export const CHARACTER_CREATION_BASE = '/Game/data/character%20creation/';

export function resolveCharacterCreationPath(fileName) {
  return `${CHARACTER_CREATION_BASE}${fileName}`;
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
    return null;
  }
}
