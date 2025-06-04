// gamestate.js

// Game state options: 'characterCreation', 'mainGame', 'battle', etc.
import { loadCharacter } from './saveManager.js';

let state = 'characterCreation';

// Import modules only when needed (code splitting)
function loadModule(modulePath) {
  return import(modulePath);
}

// Get root element
const root = document.getElementById('game-state-root');

// Load saved character, if any, and start in the main game
const savedCharacter = loadCharacter();
if (savedCharacter) {
  state = 'mainGame';
}

function setState(newState) {
  state = newState;
  render();
}

// --- Main render logic ---
async function render() {
  root.innerHTML = ''; // Clear screen
  if (state === 'characterCreation') {
    // Load character creation screen/module
    const html = document.createElement('iframe');
    html.src = 'character-creation.html';
    html.style.width = '100%';
    html.style.height = '700px';
    html.style.border = 'none';
    html.style.borderRadius = '12px';
    html.style.boxShadow = '0 0 24px #00ffff44';
    root.appendChild(html);

    // When character creation finishes, it should call parent.setState('mainGame');
    window.setState = setState; // Make setState available to iframe
  } else if (state === 'mainGame') {
    // Load the main game UI (text output, player input, etc)
    // You can expand this as needed, using your current setup
    renderMainGame();
  } else if (state === 'battle') {
    // Future: Add a battle mode render
    renderBattleMode();
  }
}

function renderMainGame() {
  root.innerHTML = `
    <section id="text-output">
      <div id="narration-box">Welcome to Infinite Ages. Your story begins...</div>
    </section>
    <input type="text" id="player-input" placeholder="What will you do?" autofocus />
  `;
  // Example: Add input handling for text parser/AI later
  document.getElementById('player-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const val = e.target.value;
      // Placeholder for your game input handler
      document.getElementById('narration-box').textContent += `\n> ${val}`;
      e.target.value = '';
    }
  });
}

function renderBattleMode() {
  root.innerHTML = `
    <h2>BATTLE MODE</h2>
    <div>[Battle UI goes here]</div>
  `;
}

// --- START ---
render();

// Export for use by other modules if needed
export { setState };
