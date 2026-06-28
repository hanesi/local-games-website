// Main application initialization

import { GameState } from './game/GameState.js';
import { Renderer } from './ui/Renderer.js';
import { DragDropHandler } from './ui/DragDropHandler.js';
import { TapHandler } from './ui/TapHandler.js';
import { UIController } from './ui/UIController.js';
import { AnimationManager } from './ui/AnimationManager.js';
import { HistoryManager } from './history/HistoryManager.js';

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create game state
  const gameState = new GameState();

  // Create managers
  const renderer = new Renderer(gameState);
  const animationManager = new AnimationManager();
  const historyManager = new HistoryManager(gameState);
  const uiController = new UIController(gameState, renderer, historyManager);

  // Create handlers with uiController reference
  const dragDropHandler = new DragDropHandler(gameState, renderer, historyManager, animationManager, uiController);
  const tapHandler = new TapHandler(gameState, renderer, historyManager, uiController);

  // Deal initial game
  gameState.dealNewGame();

  // Initialize UI
  renderer.renderAll();
  uiController.initialize();
  uiController.updateStats();
  uiController.updateButtons();

  // Detect if touch device and use appropriate handler
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  if (isTouchDevice) {
    // On touch devices, use tap handler (better UX for mobile)
    tapHandler.initialize();
    console.log('Touch device detected - using tap controls');
  } else {
    // On desktop, use drag-and-drop
    dragDropHandler.initialize();
    console.log('Desktop detected - using drag-and-drop controls');
  }

  // Make game accessible for debugging (optional)
  window.game = {
    state: gameState,
    renderer,
    historyManager,
    uiController,
    tapHandler,
    dragDropHandler
  };
});
