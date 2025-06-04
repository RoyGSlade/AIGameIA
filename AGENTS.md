---
agent: codex
project: Infinite Ages
version: 1.0
description: Modular, AI-driven, text-based RPG engine with card-based UI and human-readable JSON for all gameplay data and rules.
---

# AGENTS.md – System Definition & Implementation Card

## 1. CORE PHILOSOPHY

- Prioritize **player freedom, clarity, and extensibility**.
- **All core gameplay rules and content are stored as human-readable JSON** (races, professions, trainings, skills, powers, NPC tags, etc).
- **Every UI choice uses visually rich, interactive cards**—no default forms or unstyled lists.
- Systems are **context-driven**: every object (character, NPC, item, choice) is tagged for AI/game logic.
- Design for *future modding*, *API use*, and *GPT/AI agent parsing*.

---

## 2. FILE STRUCTURE (REFERENCE)

/data/
races.json
professions.json
trainings.json
skills.json
powers.json
personaPresets.json
npcs.json
tags.json
eras.json

/ui/
characterCreator.js
personaBuilder.js
cardComponents.js

/ai/
npcGenerator.js
narrationEngine.js

AGENTS.md
README.md

---

## 3. CHARACTER CREATION FLOW

1. **Race:** Choose from /data/races.json.  
   - Each race has: movement, vision, resistances, age, attributes, skill options, special.
2. **Profession:** From /data/professions.json.  
   - Provides: credits, passive, abilities.
3. **Training (School):** Pick from /data/trainings.json; select a Major (attribute+skill bonus).
4. **Persona:** Build via card UI or presets.  
   - Choose: background, motivation, goals, hardships, empathy, traits (pick 5, from /data/tags.json), contacts (1 positive/neutral/negative), customize appearance.
5. **Skills:** Bump one skill (from /data/skills.json) by +1.
6. **Superpowers:** Allocate 2 points in /data/powers.json using power tree, observing prerequisites.
7. **Era:** Pick from /data/eras.json (Medieval, Victorian, Modern, Future).  
   - Era affects item sets, factions, world events.
8. **Summary & Finalize:** Full sheet review. Confirm.

- **All steps must be navigable (forward/back).**
- **UI is always card-based, never default forms.**
- **No progress without fulfilling all constraints (e.g., 5 traits, 1 of each contact).**

---

## 4. GAMEPLAY LOGIC & DATA HANDLING

- **All major data is JSON, loaded at runtime.**
- **Game state (including character sheet, NPC state, choices) = JS objects, always exportable as JSON.**
- **No hard-coded “magic numbers”**—use only values from data files.
- **Every action, modifier, and tag is visible in context.**  
  (e.g., skill check DCs, bonus amounts, relationship status)
- **No hidden logic**—everything the player or AI needs is surfaced or referenced in the schema.

---

## 5. UI/UX STANDARDS

- **Cards only** (never radio/dropdown/default input).
- **Immediate feedback on hover, selection, and lockouts.**
- **Counters/guards prevent excess selections** (e.g., max 5 traits).
- **Columns:**  
  - Traits & contacts are 3-column (positive/neutral/negative).
  - Goals: 2-column (short/long term).
  - All others: 1-column scrollable cards.
- **All scrolling is within the card carousel, not the page.**
- **Scrollbars and UI style must fit the era/theme (custom scrollbar if possible).**

---

## 6. AI & AGENT INTEGRATION

- **At each logic/narration step, only surface *relevant* JSON to the LLM/agent**—never the entire database.
- **For NPC/world generation:** Compose context using the player’s current sheet, era, scene, and revealed NPC tags only.
- **For narration:**  
  - Use persona, mood, skills, and tags to flavor output.
  - Respect context (e.g., a stoic vs. flamboyant character gets different prose).
- **Skill checks:**  
  - Parse player intent, resolve with skill+attribute, narrate outcome, update state via returned JSON.
- **AI outputs:**
  - `output.text`: Human-readable narration/response.
  - `output.state`: JSON object describing all state changes (skills, tags, events, inventory, NPCs, etc).

---

## 7. EXPANDABILITY & MODDING

- **Every list (races, tags, skills, powers, professions, NPCs) must be extensible by appending to JSON.**
- **No code rewrite should be needed to add new content or expand mechanics.**
- **All data, states, and outcomes must be importable/exportable as JSON for sharing, modding, and backups.**

---

## 8. EXAMPLE TASK PROMPTS (for Codex/GPT/Agent)

- “Display all available powers from powers.json as cards, lock out any with unmet prerequisites or insufficient points.”
- “If 5 traits are already selected, unselect the oldest when a new one is chosen.”
- “Generate an NPC using tags: [role: ‘Captain’, faction: ‘Rebels’, mood: ‘Paranoid’]. Output in NPC schema.”
- “Narrate a market scene for a character with traits [Stoic, Ruthless], using the current Era: Victorian, and their contacts list.”

---

## 9. RULES OF CLARITY & STYLE

- **Favor explicitness and transparency over cleverness or brevity.**
- **Document any new rules, tags, or mechanics in the appropriate JSON and in AGENTS.md.**
- **Make all instructions clear for both human and AI contributors.**
- **If any ambiguity arises, prioritize: clarity > extensibility > style > cleverness.**

---

*This document is both the spec and style guide for all contributors, human or AI.  
Update it alongside any major system change.*

