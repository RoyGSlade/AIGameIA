# SYSTEM_SPEC.md – Infinite Ages RPG

**Version:** 1.0  
**Maintainer:** Donaven  
**Last Updated:** [Fill in date]


---
NOTE: Before starting any task, all agents (including Codex) must check `codexlog.md` for previous work on the problem. 
After completing any task, summarize the actions and changes taken as a numbered entry in `codexlog.md`.
---

## 1. CORE PRINCIPLES

- **Readability comes first:** Favor standard, clean formatting and explicit code over clever hacks.
- **Everything modular:** Features, logic, and data should be broken into reusable, self-contained functions.
- **All content and mechanics are data-driven:** Use JSON for content/config; avoid hardcoding except for ultra-minimal cases.
- **Extensibility and modding:** Structure all data and code to allow easy addition of new features/content without major rewrites.
- **Documentation by log:** All automated or AI-generated code changes must append a summary entry to `codexlog.md` with a step-numbered list of changes made.

---

## 2. FILE & FOLDER ORGANIZATION

/public # Frontend assets (HTML, CSS, JS)
/scripts # Main game logic/scripts (broken into subfolders per feature as needed)
/data # All game data (broken into NPCs, persona, powers, professions, races, skills, trainings, etc.), all in JSON format
/tests # Test files and coverage
/codexlog.md # Change log for every AI/dev agent update, numbered and clear

- All new features or modules belong in `/scripts`, with additional subfolders if the feature grows large.
- Do **not** abbreviate folder or file names; spell out for clarity.

---

## 3. CODE STYLE

- **Indentation:** Use whatever is standard for the language (default for VS Code/Prettier is fine) – the priority is readability.
- **Semicolons:** Use semicolons in JS.
- **Quotes:** Single or double quotes are fine – prefer consistency.
- **Curly Braces:** Use standard JS/ES6 formatting (same line for control structures, new line for blocks if multiline).
- **Trailing Commas:** Optional.
- **No abbreviations** – spell out variable and function names fully.
- **Constants:** Use ALL_CAPS for true constants.
- **Function Style:** Prefer small, reusable functions. Use class-based code only when it simplifies the logic.

---

## 4. NAMING CONVENTIONS

- **camelCase** for variables and functions.
- **PascalCase** for classes.
- **ALL_CAPS** for constants and constraint names.
- No abbreviations in variable, function, or file names.

---

## 5. DOCUMENTATION & LOGGING

- **No formal JSDoc/docstrings required.**
- **Instead:** After every feature/error fix or refactor, add a human-readable summary to `codexlog.md`, numbered and in plain English.
  - Example:  
    ```
    23. Fixed NPC tag assignment bug in persona builder.
    24. Added support for multiple NPC archetypes in /data/npcs.json.
    ```

---

## 6. TESTING

- Tests live in the `/tests` folder.
- Any function/module that is critical or complex should have a test.
- If unsure about framework, default to minimal hand-written tests in JS (Jest or native assertions).
- Test coverage: Focus on main game logic, tag assignment, and JSON loading/parsing.

---

## 7. ERROR HANDLING

- Use `console.log()` for all error outputs; do **not** throw or crash on errors unless absolutely necessary.
- Error messages should be plain strings, human-readable, and explain what failed.

---

## 8. LINTING

- No strict linter enforced yet; follow standard VS Code/Prettier defaults.
- If a linter is recommended, Codex should suggest it in `codexlog.md` and require user approval before adding.

---

## 9. GIT/GITHUB WORKFLOW

- All major features/fixes should be developed in their own branch or Codex thread and merged after verification.
- Each logical unit of work = one branch/thread.
- All commits/PRs should be clear and descriptive (no auto-generated messages).
- If a new npm package is required, **Codex must suggest and request approval before installing.**
- **Every added package must be listed in `codexlog.md`** with a one-line reason for its addition.

---

## 10. DEPENDENCY MANAGEMENT

- All environment variables (API keys, secrets, etc.) are referenced as placeholders (e.g., `OPENAI_API_KEY`) in the code and never stored in code or JSON.
- The local `.env` file stores real values and is listed in `.gitignore`.
- If an env var is needed, Codex should add a placeholder and document it in the log.

---

## 11. CODE REUSE & DRY

- Avoid repeated logic; prefer extracting shared helpers/utilities in `/scripts/utils/` or similar.
- Always prefer one source of truth for any data or business rule.

---

## 12. UI/UX

- All UI is card-based, futuristic, clean, blue-highlight theme with expanding/collapsible cards.
- No default browser forms or dropdowns; all selections and interactions use custom cards/components.
- Immediate hover/select feedback, and all navigation must feel snappy and clear.
- No formal accessibility standard required for now (private testing), but keep interfaces clear and navigable.

---

## 13. DATA & EXTENSIBILITY

- All game content, mechanics, and features should be **data-driven via JSON**.
- Content files must be human-readable and code-usable.
- Do not hardcode content or configuration unless absolutely unavoidable.
- Expanding content: Always verify all necessary fields exist in JSON before coding new features.
- Adding new content: Update JSON first, then update relevant code to support/consume the new data.

---

## 14. MODDING & EXPORTING

- All game state, config, and data must be importable/exportable as JSON for backups, modding, or sharing.
- No hidden logic – all outcomes and rules must be visible in code or data files.

---

## 15. SUMMARY

- **Prioritize readability, modularity, and explicit logs.**
- **Every change or decision should be documented in `codexlog.md`.**
- **Favor explicit, verbose, and human-readable over clever or obscure code.**
- **Every new file, feature, or dependency must be described in the log.**