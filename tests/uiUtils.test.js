import test from 'node:test';
import assert from 'node:assert/strict';
import { isDataLoaded } from '../public/Game/scripts/uiUtils.js';

const emptyData = {
  races: [],
  professions: [],
  trainings: [],
  skills: [],
  powers: []
};

const fullData = {
  races: [1],
  professions: [1],
  trainings: [1],
  skills: [1],
  powers: [1]
};

test('isDataLoaded returns false when any data missing', () => {
  assert.strictEqual(isDataLoaded(emptyData, null), false);
});

test('isDataLoaded returns true when all data present', () => {
  assert.strictEqual(isDataLoaded(fullData, {}), true);
});
