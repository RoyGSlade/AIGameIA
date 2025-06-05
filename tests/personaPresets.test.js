import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchJsonFile, resolveCharacterCreationPath } from '../public/Game/scripts/dataUtils.js';

const personaPath = resolveCharacterCreationPath('personaPresets.json');

test('persona presets JSON includes presetPersonas array', async () => {
  const data = await fetchJsonFile(personaPath);
  assert.ok(Array.isArray(data?.presetPersonas), 'presetPersonas should be an array');
  assert.ok(data.presetPersonas.length > 0, 'presetPersonas should contain at least one entry');
});
