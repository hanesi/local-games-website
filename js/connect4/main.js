// Connect 4 Main Application

import { GameState } from './game/GameState.js';
import { Renderer } from './ui/Renderer.js';
import { UIController } from './ui/UIController.js';

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create game state
  const gameState = new GameState();

  // Create renderer
  const renderer = new Renderer(gameState);

  // Create UI controller
  const uiController = new UIController(gameState, renderer);

  // Initialize board
  renderer.initialize();
  renderer.renderAll();

  // Initialize controls
  uiController.initialize();

  // Make accessible for debugging
  window.game = {
    state: gameState,
    renderer,
    uiController
  };

  console.log('Connect 4 initialized!');
});
