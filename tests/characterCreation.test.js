import test from 'node:test';
import assert from 'node:assert/strict';

global.window = {};
const { gameData, character, selectTraining } = await import('../public/Game/scripts/characterCreation.js');

test('selectTraining applies training and major correctly', () => {
  const mockTraining = { name: 'Mock Academy', armorRating: 5, initiative: 2 };
  gameData.trainings = [mockTraining];

  // Reset character pieces this test cares about
  character.training = null;
  character.major = null;
  character.attributes.intelligence = 0;
  character.skillChoices = [];

  selectTraining('Mock Academy', 'PsiOps', 'intelligence', 'Telepathy');

  assert.strictEqual(character.training, mockTraining);
  assert.strictEqual(character.major, 'PsiOps');
  assert.strictEqual(character.attributes.intelligence, 1);
  assert.deepStrictEqual(character.skillChoices, [{ name: 'Telepathy', level: 1 }]);
});
