// Main application initialization

import { GameState } from './game/GameState.js';
import { Renderer } from './ui/Renderer.js';
import { DragDropHandler } from './ui/DragDropHandler.js';
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
  const dragDropHandler = new DragDropHandler(gameState, renderer, historyManager, animationManager);
  const uiController = new UIController(gameState, renderer, historyManager);

  // Deal initial game
  gameState.dealNewGame();

  // Initialize UI
  renderer.renderAll();
  dragDropHandler.initialize();
  uiController.initialize();
  uiController.updateStats();
  uiController.updateButtons();

  // Make game accessible for debugging (optional)
  window.game = {
    state: gameState,
    renderer,
    historyManager,
    uiController
  };

  console.log('Klondike Solitaire initialized!');
});
