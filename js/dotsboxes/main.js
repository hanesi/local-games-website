// Dots and Boxes Main Application

import { GameState } from './game/GameState.js';
import { Renderer } from './ui/Renderer.js';
import { UIController } from './ui/UIController.js';

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Get initial grid size from selector
  const gridSizeSelect = document.getElementById('grid-size');
  const initialSize = gridSizeSelect ? parseInt(gridSizeSelect.value) : 5;

  // Create game state
  const gameState = new GameState(initialSize);

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

  console.log('Dots and Boxes initialized!');
});
