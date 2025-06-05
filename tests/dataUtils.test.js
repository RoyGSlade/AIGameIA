import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveCharacterCreationPath } from '../public/Game/scripts/dataUtils.js';

const result = resolveCharacterCreationPath('races.json');

test('resolveCharacterCreationPath points to character creation data', () => {
  assert.ok(result.includes('/Game/data/character%20creation/races.json'));
});
