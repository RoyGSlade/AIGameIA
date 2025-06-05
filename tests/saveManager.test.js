import test from 'node:test';
import assert from 'node:assert/strict';
import { saveCharacter, loadCharacter, clearSavedCharacter } from '../public/Game/scripts/saveManager.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const schemaPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../public/Game/data/schema/schema.json'
);
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));

global.localStorage = {
  data: {},
  setItem(key, val) { this.data[key] = val; },
  getItem(key) { return this.data[key] ?? null; },
  removeItem(key) { delete this.data[key]; }
};

test('save and load character retains schema version', () => {
  const char = { name: 'Tester', era: 'Modern' };
  saveCharacter(char);
  const loaded = loadCharacter();
  assert.deepStrictEqual(loaded, char);

  const raw = global.localStorage.data['currentCharacter'];
  const stored = JSON.parse(raw);
  assert.strictEqual(stored.version, schema.schemaVersion);

  clearSavedCharacter();
  assert.strictEqual(global.localStorage.data['currentCharacter'], undefined);
});
