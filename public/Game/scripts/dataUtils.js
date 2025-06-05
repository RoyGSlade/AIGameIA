export const CHARACTER_CREATION_BASE = new URL('../data/character creation/', import.meta.url);

export function resolveCharacterCreationPath(fileName) {
  return new URL(fileName, CHARACTER_CREATION_BASE).pathname;
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
