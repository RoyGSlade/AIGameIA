// characterCreation.js

import { saveCharacter as persistCharacter, clearSavedCharacter } from './saveManager.js';

// --- Game Data (mutable, shared across modules) ---
export const gameData = {
  races: [],
  professions: [],
  trainings: [],
  skills: [],
  powers: [],
  personaPresets: null // For persona builder (should be loaded via JSON)
};

// --- Character State ---
export let character = {
  name: "",
  age: null,
  race: null,
  profession: null,
  training: null,
  attributes: {
    constitution: 0, dexterity: 0, wisdom: 0, intelligence: 0, charisma: 0
  },
  skillChoices: [],
  specialAbility: null,
  vision: null,
  resistance: null,
  movement: null,
  persona: {},
  credits: 0,
  passive: null,
  earnedAbilities: [],
  armorRating: 0,
  initiative: 0,
  hitpoints: 8,
  major: null,
  powerPoints: 0,
  superpowers: [],
  startingGear: [],
  era: null,
  inspiration: false
};

// --- Track current step ---
export let currentStep = 0; // 0 = race, 1 = profession, etc.

// --- Persona (step-by-step build support) ---
export let playerPersona = {
  personality: "",
  motivation: "",
  plan: "",
  hardship: "",
  goals: { short: "", long: "" },
  empathy: "",
  traits: [],
  contacts: [],
  appearance: {
    eyeColor: "",
    hairColor: "",
    hairStyle: "",
    height: "",
    build: "",
    skinTone: "",
    features: [],
    voice: "",
    description: ""
  }
};

export function resetPersona() {
  playerPersona = {
    personality: "",
    motivation: "",
    plan: "",
    hardship: "",
    goals: { short: "", long: "" },
    empathy: "",
    traits: [],
    contacts: [],
    appearance: {
      eyeColor: "",
      hairColor: "",
      hairStyle: "",
      height: "",
      build: "",
      skinTone: "",
      features: [],
      voice: "",
      description: ""
    }
  };
}

export function getProgressSummary() {
  return {
    race: character.race ? character.race.name : null,
    profession: character.profession ? character.profession.name : null,
    training: character.training ? character.training.name : null,
    major: character.major,
    era: character.era,
    skills: character.skillChoices.map(s => `${s.name} Lv${s.level}`),
    powers: character.superpowers.map(p => `${p.tree}:${p.power}`),
    personaLoaded: Object.keys(character.persona || {}).length > 0
  };
}

export function logCharacterProgress(action) {
  console.log(`[Progress] ${action}`, getProgressSummary());
}

// --- Step Navigation ---
export function nextStep() { currentStep++; }
export function prevStep() { if (currentStep > 0) currentStep--; }

// --- STEP 1: Race ---
export function displayRaceStep() {
  showPrompt(
    `Step 1: Choose a race. Race sets movement, vision, resistance, age range, attribute bonus, skill, and possibly a special ability.`
  );
  window.displayRaceCarousel(gameData.races);
  logCharacterProgress('Displaying race step');
}

export function selectRace(raceName, selectedAge, selectedSkill) {
  const race = gameData.races.find(r => r.name === raceName);
  if (!race) return;
  character.race = race;
  character.age = selectedAge;
  character.vision = race.vision;
  character.resistance = race.resistance;
  character.movement = race.movement;
  if (race.attributeBonus) {
    const attrKey = Object.keys(race.attributeBonus)[0];
    character.attributes[attrKey] += race.attributeBonus[attrKey];
  }
  if (selectedSkill) addOrLevelSkill(selectedSkill, 1);
  character.specialAbility = race.special || null;
  logCharacterProgress(`Selected race: ${raceName}`);
}

// --- STEP 2: Profession ---
export function displayProfessionStep() {
  showPrompt(
    `Step 2: Choose a profession. Profession sets your credits, passive ability, and earned abilities.`
  );
  window.displayProfessionCarousel(gameData.professions);
  logCharacterProgress('Displaying profession step');
}

export function selectProfession(profName) {
  const prof = gameData.professions.find(p => p.name === profName);
  if (!prof) return;
  character.profession = prof;
  character.credits = prof.startingCredits;
  character.passive = prof.passive;
  character.earnedAbilities = prof.abilities || [];
  logCharacterProgress(`Selected profession: ${profName}`);
}

// --- STEP 3: Training ---
export function displayTrainingStep() {
  showPrompt(
    `Step 3: Choose your training (school). Sets armor rating, initiative, HP, gives an attribute bonus and a skill bump.`
  );
  window.displayTrainingCarousel(gameData.trainings);
  logCharacterProgress('Displaying training step');
}
export function selectTraining(trainingName, majorName, majorAttribute, skillBump) {
  const train = gameData.trainings.find(t => t.name === trainingName);
  if (!train) return;
  character.training = train;
  character.armorRating = train.armorRating;
  character.initiative = train.initiative;
  character.hitpoints = 8 + (character.attributes.constitution || 0);
  character.major = majorName;
  if (majorAttribute) character.attributes[majorAttribute] += 1;
  if (skillBump) addOrLevelSkill(skillBump, 1);
  logCharacterProgress(`Selected training: ${trainingName} with major ${majorName}`);
}

// --- STEP 4: Persona ---
// UI should call these as user steps through the builder

export function displayPersonaStep() {
  showPrompt(
    `Step 4: Build your persona. Answer questions or use a preset: background, motivation, hardships, goals, empathy, traits, contacts, appearance.`
  );
  window.displayPersonaBuilder(gameData.personaPresets); // UI passes personaData json
  logCharacterProgress('Displaying persona step');
}

// Track field changes in persona builder (for custom input)
export function setPersonaField(field, value) {
  if (field.startsWith("appearance.")) {
    const key = field.split('.')[1];
    playerPersona.appearance[key] = value;
  } else if (field === "traits" || field === "contacts") {
    playerPersona[field] = Array.isArray(value) ? value : [value];
  } else if (field === "goals") {
    playerPersona.goals = { ...playerPersona.goals, ...value };
  } else {
    playerPersona[field] = value;
  }
  logCharacterProgress(`Updated persona field: ${field}`);
}

// Load a full preset persona (overwrites all)
export function loadPresetPersona(preset) {
  Object.keys(playerPersona).forEach(field => {
    if (typeof preset[field] === "object" && !Array.isArray(preset[field])) {
      playerPersona[field] = { ...preset[field] };
    } else {
      playerPersona[field] = preset[field];
    }
  });
  logCharacterProgress(`Loaded preset persona: ${preset.name || 'unnamed'}`);
}

// Finalize persona on character (call at end of persona step)
export function setPersonaOnCharacter(skillToBump = null) {
  character.persona = JSON.parse(JSON.stringify(playerPersona));
  if (skillToBump) addOrLevelSkill(skillToBump, 1);
  logCharacterProgress('Persona finalized');
}

// --- STEP 5: Skills (just info step, handled by UI) ---
export function displaySkillSystemStep() {
  showPrompt(
    `Step 5: Select a starting skill.`
  );
  window.displaySkillSelection(gameData.skills);
  logCharacterProgress('Displaying skill selection step');
}

// --- STEP 6: Superpowers ---
export function displaySuperpowerStep() {
  showPrompt(
    `Step 6: Superpowers. If your game uses them, select a power. You get 2 points at level 1.`
  );
  window.displayPowerCarousel(gameData.powers);
  logCharacterProgress('Displaying superpower step');
}
export function selectSuperpower(treeName, powerObj) {
  const tree = gameData.powers.find(p => p.name === treeName);
  if (!tree || !powerObj) return;
  // powerObj should include at least { power, level }
  character.superpowers.push({
    tree: treeName,
    power: powerObj.power,
    level: powerObj.level
  });
  character.powerPoints += powerObj.level;
  logCharacterProgress(`Selected superpower ${powerObj.power} from ${treeName}`);
}

// --- STEP 7: Era ---
export function displayEraStep() {
  showPrompt(
    `Step 7: Choose your era: Victorian, Modern, Cyberpunk, or Firefly/Star Trek.`
  );
  window.displayEraSelector();
  logCharacterProgress('Displaying era step');
}
export function selectEra(era) {
  character.era = era;
  logCharacterProgress(`Selected era: ${era}`);
}

// --- STEP 8: Summary ---
export function displaySummaryStep() {
  showPrompt(`Step 8: Review your choices. This is your character sheet. If satisfied, confirm.`);
  window.displayCharacterSheet(character);
  logCharacterProgress('Displaying summary step');
}
export function finalizeCharacter() {
  character.inspiration = true;
  persistCharacter(character);
  showPrompt(`You gain inspiration for completing character creation. Let's play!`);
  if (window.parent && window.parent.setState) window.parent.setState('mainGame');
  logCharacterProgress('Character creation complete');
}

// --- Helpers ---
function addOrLevelSkill(skillName, level) {
  if (!skillName) return;
  let idx = character.skillChoices.findIndex(s => s.name === skillName);
  if (idx > -1) character.skillChoices[idx].level = Math.max(character.skillChoices[idx].level, level);
  else character.skillChoices.push({ name: skillName, level });
}

export function selectStartingSkill(skillName) {
  addOrLevelSkill(skillName, 1);
  logCharacterProgress(`Selected starting skill: ${skillName}`);
}

export function resetSavedCharacter() {
  clearSavedCharacter();
  logCharacterProgress('Saved character reset');
}

// UI helper stubs (will be overwritten by UI file)
function showPrompt(txt) { }

window.selectTraining = selectTraining;
window.selectRace = selectRace;
window.selectProfession = selectProfession;
window.selectSuperpower = selectSuperpower;
window.selectEra = selectEra;
window.selectStartingSkill = selectStartingSkill;
window.resetSavedCharacter = resetSavedCharacter;
