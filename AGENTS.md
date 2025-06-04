---
AGENT HANDOFF PROTOCOL – Infinite Ages
version: 1.0
see: SYSTEM_SPEC.md for gameplay/data/UI rules
---
if you are codex check the SYSTEM_SPEC.md file to verify you are following code philosophy 
## AGENTS
- **Brain (GPT-4.1):** Logic, rules, state, context, calls all shots.
- **Mouth (GPT-4.1 mini):** Pure narrative output; never alters state.
- **Features (GPT-4o mini high):** Rarely invoked for unique items/powers, only by Brain.

## FLOW
Player → Brain → [Mouth for narration] → Player  
Brain → [Features, as needed] → Brain (validate) → World

## DATA
- All state/world data is JSON, Brain is source of truth.
- Mouth only sees filtered context.
- Features gets context only as needed for reward/event.

## OOC
If player sends `/ooc`, Brain responds with meta/rule info, not narrative.

## DEBUG
Debug logging is on by default, toggled via game config or console.

---

*See SYSTEM_SPEC.md for coding, data, and UI standards.*
