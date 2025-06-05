import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchJsonFile, resolveCharacterCreationPath } from '../public/Game/scripts/dataUtils.js';

const jsonPath = resolveCharacterCreationPath('races.json');

async function directImport(path) {
  const fileUrl = new URL(`../public${path}`, import.meta.url).href;
  try {
    return (await import(fileUrl, { with: { type: 'json' } })).default;
  } catch {
    return (await import(fileUrl, { assert: { type: 'json' } })).default;
  }
}

test('fetchJsonFile falls back to dynamic import when fetch fails', async () => {
  let fetchCalled = false;
  global.fetch = async () => {
    fetchCalled = true;
    throw new Error('Network failure');
  };

  const expected = await directImport(jsonPath);
  const data = await fetchJsonFile(jsonPath);

  assert.ok(fetchCalled);
  assert.deepStrictEqual(data, expected);

  global.fetch = undefined;
});
