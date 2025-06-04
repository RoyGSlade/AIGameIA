// characterCreationUI.js

import {
  gameData, nextStep, prevStep,
  displayRaceStep, displayProfessionStep, displayTrainingStep,
  displayPersonaStep, displaySkillSystemStep, displaySuperpowerStep,
  displayEraStep, displaySummaryStep, finalizeCharacter,
  selectRace, selectProfession, selectTraining,
  playerPersona, character
} from './characterCreation.js';

let personaData = null;

async function loadAllData() {
  gameData.races = await (await fetch('./data/races.json')).json();
  gameData.professions = await (await fetch('./data/professions.json')).json();
  gameData.trainings = await (await fetch('./data/trainings.json')).json();
  gameData.skills = await (await fetch('./data/skills.json')).json();
  gameData.powers = await (await fetch('./data/powers.json')).json();
  gameData.personaPresets = await (await fetch('./data/personaPresets.json')).json();
  personaData = gameData.personaPresets;
  console.log("personaData loaded:", personaData);
}


const content = document.getElementById('carousel-content');
const prompt = document.getElementById('prompt-text');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trainingPanel = document.getElementById('training-panel');
const progressNav = document.getElementById('progress-nav');

const stepNames = ['Race','Profession','Training','Persona','Skills','Superpowers','Era','Summary'];

function initProgressNav() {
  progressNav.innerHTML = stepNames.map(n => `<span class="step">${n}</span>`).join('');
}

function updateProgressNav(step) {
  const nodes = progressNav.querySelectorAll('.step');
  nodes.forEach((n,i) => n.classList.toggle('active', i === step));
}

let uiStep = 0;

async function init() {
  await loadAllData();
  uiStep = 0;
  initProgressNav();
  renderStep();
}

nextBtn.onclick = () => {
  nextStep();
  uiStep++;
  renderStep();
};
prevBtn.onclick = () => {
  prevStep();
  uiStep--;
  renderStep();
};

function renderStep() {
  nextBtn.textContent = 'Next';
  prevBtn.textContent = 'Back';
  nextBtn.disabled = false;
  prevBtn.disabled = false;
  trainingPanel.style.display = uiStep === 2 ? 'block' : 'none';
  updateProgressNav(uiStep);
  switch (uiStep) {
    case 0: displayRaceStep(); break;
    case 1: displayProfessionStep(); break;
    case 2: displayTrainingStep(); break;
    case 3: displayPersonaStep(); break;
    case 4: displaySkillSystemStep(); break;
    case 5: displaySuperpowerStep(); break;
    case 6: displayEraStep(); break;
    case 7: displaySummaryStep(); break;
    default: finalizeCharacter(); break;
  }
}

// --- UI HOOKS FOR characterCreation.js ---

window.showPrompt = function (txt) {
  prompt.textContent = txt;
};
// --- Carousel Control ---
let currentIndex = 0; // For showing 2 cards at a time

window.displayRaceCarousel = function (races) {
  content.innerHTML = '';
  if (!races || races.length === 0) {
    content.innerHTML = '<p>No races loaded!</p>';
    return;
  }

  // Clamp bounds so you don't overflow at end
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > races.length - 2) currentIndex = races.length - 2;

  // Show 2 at a time
  for (let i = currentIndex; i < Math.min(currentIndex + 2, races.length); i++) {
    const race = races[i];
    const bonusKey = race.attributeBonus ? Object.keys(race.attributeBonus)[0] : "";
    const bonusVal = race.attributeBonus ? Object.values(race.attributeBonus)[0] : "";

    const card = document.createElement('div');
    card.className = 'carousel-card neon-frame';
    card.setAttribute('role','button');
    card.tabIndex = 0;
    card.innerHTML = `
      <h2>${race.name}</h2>
      <p>${race.description}</p>
      <ul>
        <li>Movement: ${race.movement || "Not set"}</li>
        <li>Vision: ${race.vision || "Not set"}</li>
        <li>Resistance: ${race.resistance || "None"}</li>
        <li>Age: ${race.age || "Not set"}</li>
        <li>Attribute Bonus: ${bonusVal ? "+" + bonusVal + " " + bonusKey.charAt(0).toUpperCase() + bonusKey.slice(1) : "None"}</li>
        <li>Special: ${race.special || "None"}</li>
      </ul>`;
    card.onclick = () => {
      Array.from(content.getElementsByClassName('carousel-card')).forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      setTimeout(() => {
        selectRace(race.name, race.age, race.skillChoice ? race.skillChoice[0] : null);
        uiStep++;
        currentIndex = 0;
        renderStep();
      }, 200);
    };
    card.ondblclick = () => { selectRace(race.name, race.age, race.skillChoice ? race.skillChoice[0] : null); uiStep++; currentIndex=0; renderStep(); };
    card.onkeydown = (e) => { if (e.key==='Enter') card.click(); if (e.key==='Escape') { prevStep(); uiStep--; renderStep(); } };
    content.appendChild(card);
  }

  // no separate select buttons

  // --- Control Prev/Next for Carousel Only ---
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= races.length - 2;

  prevBtn.onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      window.displayRaceCarousel(races);
    }
  };
  nextBtn.onclick = () => {
    if (currentIndex < races.length - 2) {
      currentIndex++;
      window.displayRaceCarousel(races);
    }
  };
};

// --- Carousel State ---
let professionIndex = 0;
let trainingIndex = 0;
let powerIndex = 0; // index for choosing a power tree
let powerPoints = 2; // Starting PowerPoints
let selectedTree = null;
let chosenPowers = []; // store selected powers for the chosen tree

// --- Professions Carousel ---
window.displayProfessionCarousel = function (professions) {
  content.innerHTML = '';
  if (!professions || professions.length === 0) {
    content.innerHTML = '<p>No professions loaded!</p>';
    return;
  }
  // Clamp
  if (professionIndex < 0) professionIndex = 0;
  if (professionIndex > professions.length - 2) professionIndex = professions.length - 2;

  for (let i = professionIndex; i < Math.min(professionIndex + 2, professions.length); i++) {
    const prof = professions[i];
    const abilities = Object.entries(prof.abilities || {}).map(([level, desc]) =>
      `<li>Level ${level}: ${desc}</li>`).join('');
    const card = document.createElement('div');
    card.className = 'carousel-card neon-frame';
    card.setAttribute('role','button');
    card.tabIndex = 0;
    card.innerHTML = `
      <h2>${prof.name}</h2>
      <p>${prof.description || ''}</p>
      <ul>
        <li>Starting Credits: ${prof.credits || ''}</li>
        <li>Passive: ${prof.passive || ''}</li>
        ${abilities}
      </ul>`;
    card.onclick = () => {
      Array.from(content.getElementsByClassName('carousel-card')).forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      setTimeout(() => { selectProfession(prof.name); uiStep++; professionIndex=0; renderStep(); }, 200);
    };
    card.ondblclick = () => { selectProfession(prof.name); uiStep++; professionIndex=0; renderStep(); };
    card.onkeydown = (e) => { if (e.key==='Enter') card.click(); if (e.key==='Escape'){ prevStep(); uiStep--; renderStep(); } };
    content.appendChild(card);
  }

  prevBtn.disabled = professionIndex === 0;
  nextBtn.disabled = professionIndex >= professions.length - 2;
  prevBtn.onclick = () => {
    if (professionIndex > 0) {
      professionIndex--;
      window.displayProfessionCarousel(professions);
    }
  };
  nextBtn.onclick = () => {
    if (professionIndex < professions.length - 2) {
      professionIndex++;
      window.displayProfessionCarousel(professions);
    }
  };
};

// --- Training Carousel ---
window.displayTrainingCarousel = function (trainings) {
  if (!trainings || trainings.length === 0) {
    content.innerHTML = '<p>No trainings loaded!</p>';
    trainingPanel.style.display = 'none';
    return;
  }

  // Clamp index and select the current training to display
  if (trainingIndex < 0) trainingIndex = 0;
  if (trainingIndex > trainings.length - 1) trainingIndex = trainings.length - 1;

  const t = trainings[trainingIndex];

  trainingPanel.innerHTML = `
    <h2>${t.name}</h2>
    <p>${t.description || ''}</p>
    <ul>
      <li><b>Armor Rating:</b> ${t.armorRating}</li>
      <li><b>Initiative:</b> ${t.initiative > 0 ? '+' : ''}${t.initiative}</li>
      <li><b>Hit Points:</b> ${t.hitPoints} + Constitution</li>
    </ul>
  `;
  trainingPanel.style.display = 'block';

  let right = `<div class="training-majors">`;
  t.majors.forEach((major, idx) => {
    right += `
      <div class="major-card" role="button" tabindex="0" data-major="${major.name}" data-training="${t.name}">
        <h3>${major.name}</h3>
        <p>${major.description || ''}</p>
        <ul>
          <li><b>Attribute Bonus:</b> +1 ${major.attribute.charAt(0).toUpperCase() + major.attribute.slice(1)}</li>
          <li><b>Skill Increase:</b> ${major.skill}</li>
        </ul>
      </div>
    `;
  });
  right += `</div>`;

  content.innerHTML = right;

  Array.from(document.getElementsByClassName('major-card')).forEach(card => {
    card.onclick = () => {
      Array.from(document.getElementsByClassName('major-card')).forEach(c=>c.classList.remove('selected'));
      card.classList.add('selected');
      const major = t.majors.find(m => m.name === card.dataset.major);
      setTimeout(() => { window.selectTraining(t.name, major.name, major.attribute, major.skill); uiStep++; renderStep(); }, 200);
    };
    card.ondblclick = () => { const major = t.majors.find(m => m.name === card.dataset.major); window.selectTraining(t.name, major.name, major.attribute, major.skill); uiStep++; renderStep(); };
    card.onkeydown = (e) => { if(e.key==='Enter') card.click(); if(e.key==='Escape'){ prevStep(); uiStep--; renderStep(); } };
  });

  // Configure carousel navigation using the global prev/next buttons
  // Always enable the back button so the user can return to the Profession step
  prevBtn.disabled = false;
  nextBtn.disabled = trainingIndex === trainings.length - 1;
  prevBtn.onclick = () => {
    if (trainingIndex > 0) {
      trainingIndex--;
      window.displayTrainingCarousel(trainings);
    } else {
      // At the first card, go back to the Profession step
      prevStep();
      uiStep--;
      renderStep();
    }
  };
  nextBtn.onclick = () => {
    if (trainingIndex < trainings.length - 1) {
      trainingIndex++;
      window.displayTrainingCarousel(trainings);
    }
  };
};


// Assuming personaPresets and options are loaded as personaData

let personaStep = 0; // step in persona builder
let usePreset = false;
let selectedPreset = null;

window.displayPersonaStep = function () {
  content.innerHTML = '';
  prompt.textContent = "Would you like to use a persona preset or build your own?";

  const usePresetBtn = document.createElement('button');
  usePresetBtn.textContent = "Use a Preset";
  usePresetBtn.className = 'select-btn';
  usePresetBtn.onclick = () => {
    usePreset = true;
    personaStep = 0;
    showPresetCarousel();
  };
  const buildOwnBtn = document.createElement('button');
  buildOwnBtn.textContent = "Build My Own";
  buildOwnBtn.className = 'select-btn';
  buildOwnBtn.onclick = () => {
    usePreset = false;
    personaStep = 0;
    showPersonaBuilder();
  };
  const optionsDiv = document.createElement('div');
  optionsDiv.id = 'persona-options';
  optionsDiv.appendChild(usePresetBtn);
  optionsDiv.appendChild(buildOwnBtn);
  content.appendChild(optionsDiv);
};

// ---- Preset Persona Carousel ----
function showPresetCarousel() {
  content.innerHTML = '';
  prompt.textContent = "Choose a preset persona or go back.";

  let presetIdx = 0;
  const presets = personaData.presetPersonas;

  function renderPreset(idx) {
    content.innerHTML = '';
    const p = presets[idx];
    const card = document.createElement('div');
    card.className = 'carousel-card neon-frame';
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p><b>Personality:</b> ${p.personality}</p>
      <p><b>Motivation:</b> ${p.motivation}</p>
      <p><b>Plan:</b> ${p.plan}</p>
      <p><b>Hardship:</b> ${p.hardship}</p>
      <p><b>Goals:</b> ${p.goals.short} / ${p.goals.long}</p>
      <p><b>Empathy:</b> ${p.empathy}</p>
      <p><b>Traits:</b> ${p.traits.join(', ')}</p>
      <p><b>Contacts:</b> ${p.contacts.map(c => c.name + " (" + c.relationship + ")").join(', ')}</p>
      <p><b>Description:</b> ${p.description}</p>
    `;
    content.appendChild(card);

    // Nav buttons
    const prev = document.createElement('button');
    prev.textContent = "Prev";
    prev.disabled = idx === 0;
    prev.onclick = () => renderPreset(idx - 1);

    const next = document.createElement('button');
    next.textContent = "Next";
    next.disabled = idx === presets.length - 1;
    next.onclick = () => renderPreset(idx + 1);

    const select = document.createElement('button');
    select.textContent = "Select This Persona";
    select.onclick = () => {
      loadPresetPersona(p);
      uiStep++;
      renderStep();
    };

    content.appendChild(prev);
    content.appendChild(next);
    content.appendChild(select);

    // Option to go back
    const back = document.createElement('button');
    back.textContent = "Back";
    back.onclick = window.displayPersonaStep;
    content.appendChild(back);
  }
  renderPreset(presetIdx);
}

// ---- Step-by-Step Builder ----
const personaFields = [
  { key: "personality", label: "Personality", options: () => personaData.personalityTypes.map(t => t.description) },
  { key: "motivation", label: "Motivation", options: () => personaData.motivations },
  { key: "plan", label: "Plan", options: () => personaData.plans },
  { key: "hardship", label: "Hardship", options: () => personaData.hardships },
  { key: "goals", label: "Goals", options: () => personaData.goals.map(g => g.short + " / " + g.long) },
  { key: "empathy", label: "Empathy", options: () => personaData.empathy },
  { key: "traits", label: "Traits", options: () => personaData.traits },
  { key: "contacts", label: "Contacts", options: () => personaData.contacts.map(c => `${c.name} (${c.relationship})`) },
  { key: "appearance", label: "Appearance", options: () => ["Build your character's look using appearance options below"] }
];

// Tracks temporary values during build
let buildPersona = {};

function showPersonaBuilder() {
  if (!personaData || !personaData.personalityTypes) {
    prompt.textContent = "Persona options not loaded yet. Please wait...";
    return;
  }

  content.innerHTML = '';

  // finalize
  if (personaStep >= personaFields.length) {
    if (!allPersonaFieldsFilled(buildPersona)) {
      prompt.textContent = "Please complete all fields before continuing.";
      personaStep = 0;
      showPersonaBuilder();
      return;
    }
    Object.assign(playerPersona, buildPersona);
    nextStep();
    uiStep++;
    renderStep();
    return;
  }

  const field = personaFields[personaStep];
  prompt.textContent = `Select or enter your ${field.label}:`;

  let validator = () => true;

  if (field.key === 'appearance') {
    showAppearanceBuilder();
    validator = (checkOnly=false) => {
      const data = {
        eyeColor: document.getElementById('eyeColor').value,
        hairColor: document.getElementById('hairColor').value,
        hairStyle: document.getElementById('hairStyle').value,
        height: document.getElementById('height').value,
        build: document.getElementById('build').value,
        skinTone: document.getElementById('skinTone').value,
        features: Array.from(document.getElementById('features').selectedOptions).map(o => o.value),
        voice: document.getElementById('voice').value,
        description: document.getElementById('desc').value
      };
      if (!checkOnly) buildPersona.appearance = data;
      return data.eyeColor && data.hairColor && data.hairStyle;
    };
    content.addEventListener('input', () => checkValid());
    content.addEventListener('change', () => checkValid());
  } else if (field.key === 'traits') {
    const cats = {};
    personaData.traits.forEach(t => { if(!cats[t.category]) cats[t.category] = []; cats[t.category].push(t.name); });
    const counter = document.createElement('div');
    counter.id = 'trait-count';
    counter.textContent = 'Selected: 0/5';
    content.appendChild(counter);
    const selected = new Set();
    Object.keys(cats).forEach(cat => {
      const sec = document.createElement('div');
      sec.innerHTML = `<h4>${cat}</h4>`;
      const row = document.createElement('div');
      row.className = 'scroll-row';
      cats[cat].forEach(name => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.tabIndex = 0;
        card.textContent = name;
        card.onclick = () => {
          if (selected.has(name)) { selected.delete(name); card.classList.remove('selected'); }
          else if (selected.size < 5) { selected.add(name); card.classList.add('selected'); }
          counter.textContent = `Selected: ${selected.size}/5`;
          checkValid();
        };
        card.onkeydown = (e) => { if(e.key==='Enter') card.click(); };
        row.appendChild(card);
      });
      sec.appendChild(row);
      content.appendChild(sec);
    });
    validator = (checkOnly=false) => {
      if (!checkOnly) buildPersona.traits = Array.from(selected);
      return selected.size === 5;
    };
  } else if (field.key === 'contacts') {
    const cats = {};
    personaData.contacts.forEach((c,i) => { if(!cats[c.category]) cats[c.category] = []; cats[c.category].push({c,i}); });
    const counter = document.createElement('div');
    counter.id = 'contact-count';
    counter.textContent = 'Selected: 0/3';
    content.appendChild(counter);
    const selected = new Set();
    Object.keys(cats).forEach(cat => {
      const sec = document.createElement('div');
      sec.innerHTML = `<h4>${cat}</h4>`;
      const row = document.createElement('div');
      row.className = 'scroll-row';
      cats[cat].forEach(obj => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.tabIndex = 0;
        card.textContent = `${obj.c.name}`;
        card.onclick = () => {
          if (selected.has(obj.i)) { selected.delete(obj.i); card.classList.remove('selected'); }
          else if (selected.size < 3) { selected.add(obj.i); card.classList.add('selected'); }
          counter.textContent = `Selected: ${selected.size}/3`;
          checkValid();
        };
        card.onkeydown = (e)=>{ if(e.key==='Enter') card.click(); };
        row.appendChild(card);
      });
      sec.appendChild(row);
      content.appendChild(sec);
    });
    validator = (checkOnly=false) => {
      if(!checkOnly) buildPersona.contacts = Array.from(selected).map(i => personaData.contacts[i]);
      return selected.size === 3;
    };
  } else if (field.key === 'goals') {
    content.innerHTML = `
      <div id="goals-container">
        <div id="short-col" class="goal-col scroll-column"></div>
        <div id="long-col" class="goal-col scroll-column"></div>
      </div>
    `;
    const shortCol = document.getElementById('short-col');
    const longCol = document.getElementById('long-col');
    let chosenShort = null;
    let chosenLong = null;
    personaData.goals.forEach(g => {
      const s = document.createElement('div');
      s.className = 'option-card';
      s.textContent = g.short;
      s.onclick = () => {
        if (chosenShort) chosenShort.classList.remove('selected');
        s.classList.add('selected');
        chosenShort = s;
        checkValid();
      };
      shortCol.appendChild(s);
      const l = document.createElement('div');
      l.className = 'option-card';
      l.textContent = g.long;
      l.onclick = () => {
        if (chosenLong) chosenLong.classList.remove('selected');
        l.classList.add('selected');
        chosenLong = l;
        checkValid();
      };
      longCol.appendChild(l);
    });
    validator = (checkOnly=false) => {
      if (!checkOnly) buildPersona.goals = {
        short: chosenShort ? chosenShort.textContent : '',
        long: chosenLong ? chosenLong.textContent : ''
      };
      return chosenShort && chosenLong;
    };
  } else {
    const col = document.createElement('div');
    col.className = 'scroll-column';
    let chosen = null;
    field.options().forEach(opt => {
      const card = document.createElement('div');
      card.className = 'option-card';
      card.textContent = opt;
      card.tabIndex = 0;
      card.onclick = () => {
        if (chosen) chosen.classList.remove('selected');
        card.classList.add('selected');
        chosen = card;
        checkValid();
      };
      card.onkeydown = e => { if(e.key==='Enter') card.click(); };
      col.appendChild(card);
    });
    content.appendChild(col);
    const customLabel = document.createElement('label');
    customLabel.innerHTML = `Write your own:`;
    const customInput = document.createElement('input');
    customInput.id = `custom-${field.key}`;
    customInput.className = 'styled-input';
    customInput.placeholder = 'Your answer';
    customInput.addEventListener('input', () => { if(chosen) { chosen.classList.remove('selected'); chosen=null; } checkValid(); });
    customLabel.appendChild(customInput);
    content.appendChild(customLabel);
    validator = (checkOnly=false) => {
      const custom = customInput.value.trim();
      const val = custom || (chosen && chosen.textContent) || '';
      if (!checkOnly) buildPersona[field.key] = val;
      return val !== '';
    };
  }

  function checkValid() { nextBtn.disabled = !validator(true); }

  nextBtn.textContent = personaStep === personaFields.length - 1 ? 'Finish Persona' : 'Next';
  checkValid();

  nextBtn.onclick = () => {
    if (validator()) {
      personaStep++;
      showPersonaBuilder();
    }
  };

  prevBtn.onclick = () => {
    if (personaStep === 0) {
      prevStep();
      uiStep--;
      renderStep();
    } else {
      personaStep--;
      showPersonaBuilder();
    }
  };
}

function showAppearanceBuilder() {
  // Present dropdowns for each appearance field with options, plus a freeform description at end
  const opts = personaData.appearanceDetails;
  content.innerHTML = `
    <label>Eye Color: <select class="custom-select" id="eyeColor">${opts.eyeColors.map(c => `<option>${c}</option>`)}</select></label><br>
    <label>Hair Color: <select class="custom-select" id="hairColor">${opts.hairColors.map(c => `<option>${c}</option>`)}</select></label><br>
    <label>Hair Style: <select class="custom-select" id="hairStyle">${opts.hairStyles.map(c => `<option>${c}</option>`)}</select></label><br>
    <label>Height: <select class="custom-select" id="height">${opts.height.map(c => `<option>${c}</option>`)}</select></label><br>
    <label>Build: <select class="custom-select" id="build">${opts.build.map(c => `<option>${c}</option>`)}</select></label><br>
    <label>Skin Tone: <select class="custom-select" id="skinTone">${opts.skinTones.map(c => `<option>${c}</option>`)}</select></label><br>
    <label>Features: <select multiple class="custom-select" id="features">${opts.features.map(c => `<option>${c}</option>`)}</select></label><br>
    <label>Voice: <select class="custom-select" id="voice">${opts.voice.map(c => `<option>${c}</option>`)}</select></label><br>
    <label>Description: <textarea id="desc" class="styled-input" rows="2" placeholder="Your description"></textarea></label><br>
  `;
}
const requiredFields = [
  "personality", "motivation", "plan", "hardship", "goals",
  "empathy", "traits", "contacts", "appearance"
];

function allPersonaFieldsFilled(obj) {
  for (const key of requiredFields) {
    if (!obj[key] || (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)) return false;
  }
  if (!obj.traits || obj.traits.length === 0) return false;
  if (!obj.contacts || obj.contacts.length === 0) return false;
  if (!obj.appearance || Object.keys(obj.appearance).length === 0) return false;
  return true;
}

// --- Skill System Info ---
window.displaySkillSelection = function(skills) {
  content.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'skill-grid';
  let chosen = null;
  skills.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'skill-card neon-frame';
    card.setAttribute('role','button');
    card.tabIndex = 0;
    card.innerHTML = `<h3>${skill.name}</h3><p>${skill.description}</p>`;
    card.onclick = () => {
      if (chosen) chosen.classList.remove('selected');
      card.classList.add('selected');
      chosen = card;
      setTimeout(() => { window.selectStartingSkill(skill.name); uiStep++; renderStep(); }, 200);
    };
    card.ondblclick = () => { window.selectStartingSkill(skill.name); uiStep++; renderStep(); };
    card.onkeydown = (e) => { if(e.key==='Enter') card.click(); if(e.key==='Escape'){ prevStep(); uiStep--; renderStep(); } };
    grid.appendChild(card);
  });
  content.appendChild(grid);
  prevBtn.disabled = false;
  nextBtn.disabled = true;
  prevBtn.onclick = () => { prevStep(); uiStep--; renderStep(); };
  nextBtn.onclick = () => {};
};

// --- Power Carousel ---
window.displayPowerCarousel = function (powers) {
  content.innerHTML = '';
  if (!powers || powers.length === 0) {
    content.innerHTML = '<p>No powers loaded!</p>';
    return;
  }

  if (!selectedTree) {
    if (powerIndex < 0) powerIndex = 0;
    if (powerIndex > powers.length - 1) powerIndex = powers.length - 1;

    const tree = powers[powerIndex];
    const card = document.createElement('div');
    card.className = 'carousel-card neon-frame power-tree-card';
    card.setAttribute('role','button');
    card.tabIndex = 0;
    card.innerHTML = `
      <h2>${tree.name}</h2>
      <p>${tree.description || ''}</p>`;
    card.onclick = () => {
      selectedTree = tree;
      const lvl0 = tree.levels.find(l => l.level === 0);
      if (lvl0) chosenPowers.push(lvl0);
      window.displayPowerCarousel(powers);
    };
    card.ondblclick = () => { selectedTree = tree; const lvl0 = tree.levels.find(l=>l.level===0); if(lvl0) chosenPowers.push(lvl0); window.displayPowerCarousel(powers); };
    card.onkeydown = (e)=>{ if(e.key==='Enter') card.click(); if(e.key==='Escape'){ prevStep(); uiStep--; renderStep(); } };
    content.appendChild(card);

    prevBtn.disabled = false;
    nextBtn.disabled = powerIndex === powers.length - 1;
    prevBtn.onclick = () => {
      if (powerIndex > 0) {
        powerIndex--;
        window.displayPowerCarousel(powers);
      } else {
        prevStep();
        uiStep--;
        renderStep();
      }
    };
    nextBtn.onclick = () => { if (powerIndex < powers.length - 1) { powerIndex++; window.displayPowerCarousel(powers); } };

    // navigation handled on card click
  } else {
    showPowerTree(selectedTree, powers);
  }
};

function showPowerTree(tree, powers) {
  content.innerHTML = '';
  const info = document.createElement('div');
  info.className = 'power-tree-info';
  const spent = chosenPowers.reduce((a,p)=>a+p.level,0);
  info.innerHTML = `<h2>${tree.name}</h2><p>${tree.description || ''}</p><p>Power Points: ${spent}/${powerPoints}</p>`;
  content.appendChild(info);

  let remaining = powerPoints - chosenPowers.reduce((a,p)=>a+p.level,0);
  const grouped = {};
  const hasL1 = chosenPowers.some(p => p.level === 1);
  tree.levels.forEach(l => {
    if (l.level === 1 || (hasL1 && l.level > 1 && l.level <= powerPoints)) {
      if (!grouped[l.level]) grouped[l.level] = [];
      grouped[l.level].push(l);
    }
  });

  Object.keys(grouped).sort((a,b)=>a-b).forEach(lvl => {
    const section = document.createElement('div');
    section.className = 'power-level-section';
    section.innerHTML = `<h3>Level ${lvl} Powers (Cost ${lvl})</h3>`;
    const grid = document.createElement('div');
    grid.className = 'power-grid';
    grouped[lvl].forEach(p => {
      const card = document.createElement('div');
      const already = chosenPowers.find(cp => cp.power === p.power);
      card.className = 'power-card option-card';
      card.setAttribute('role','button');
      card.tabIndex = 0;
      card.innerHTML = `
        <h4>${p.power}</h4>
        <p><b>Activation:</b> ${p.activation_cost}</p>
        <p><b>Duration:</b> ${p.duration}</p>
        <p><b>Range:</b> ${p.range}</p>
        <p><b>Uses:</b> ${p.uses}</p>
        <p>${p.effect}</p>
      `;
      if(already) card.classList.add('selected');
      if(p.level>remaining && !already) card.style.opacity='0.5';
      card.onclick = () => {
        if (p.level <= remaining && !already) {
          chosenPowers.push(p);
          showPowerTree(tree, powers);
        }
      };
      card.onkeydown = (e)=>{ if(e.key==='Enter') card.click(); };
      grid.appendChild(card);
    });
    section.appendChild(grid);
    content.appendChild(section);
  });

  const confirm = document.createElement('button');
  confirm.className = 'select-btn';
  confirm.textContent = 'Confirm Powers';
  confirm.onclick = () => {
    chosenPowers.forEach(cp => window.selectSuperpower(tree.name, cp));
    uiStep++;
    renderStep();
  };
  content.appendChild(confirm);

  prevBtn.disabled = false;
  nextBtn.disabled = true;
  prevBtn.onclick = () => { selectedTree = null; chosenPowers = []; window.displayPowerCarousel(powers); };
  nextBtn.onclick = () => {};
}

// --- Era Selector ---
window.displayEraSelector = function () {
  content.innerHTML = '';

  const eras = [
    {
      name: 'Medieval',
      text: 'An age of knights, castles and ancient magic.'
    },
    {
      name: 'Victorian',
      text: 'Industry and intrigue within a steampunk world.'
    },
    {
      name: 'Modern',
      text: 'The familiar present day with a twist of adventure.'
    },
    {
      name: 'Future',
      text: 'Advanced technology and far‑flung frontiers.'
    }
  ];

  eras.forEach(era => {
    const card = document.createElement('div');
    card.className = 'carousel-card neon-frame era-card';
    card.tabIndex = 0;
    card.innerHTML = `<h3>${era.name}</h3><p>${era.text}</p>`;
    if (character.era === era.name) card.classList.add('selected');
    card.onclick = () => {
      Array.from(document.getElementsByClassName('era-card')).forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      setTimeout(() => {
        window.selectEra(era.name);
        uiStep++;
        renderStep();
      }, 200);
    };
    card.ondblclick = () => {
      window.selectEra(era.name);
      uiStep++;
      renderStep();
    };
    card.onkeydown = (e) => { if (e.key === 'Enter') card.click(); };
    content.appendChild(card);
  });

  prevBtn.disabled = false;
  nextBtn.disabled = true;
  prevBtn.onclick = () => { prevStep(); uiStep--; renderStep(); };
  nextBtn.onclick = () => {};
};
window.displayPersonaBuilder = window.displayPersonaStep; // <-- this covers the "preset or build" screen


// --- Run on page load ---
window.addEventListener('DOMContentLoaded', init);

