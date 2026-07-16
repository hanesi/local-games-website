// UI controls (buttons, timer, stats)

import { formatTime } from '../utils/helpers.js';
import { MoveValidator } from '../game/MoveValidator.js';

export class UIController {
  constructor(gameState, renderer, historyManager) {
    this.gameState = gameState;
    this.renderer = renderer;
    this.historyManager = historyManager;
    this.timerInterval = null;
  }

  /**
   * Initializes UI controls
   */
  initialize() {
    console.log('Initializing UI controls...');

    // New Game button
    const newGameBtn = document.getElementById('new-game-btn');
    console.log('New game button:', newGameBtn);
    if (newGameBtn) {
      newGameBtn.addEventListener('click', () => this.handleNewGame());
      console.log('New game button listener added');
    } else {
      console.error('New game button not found!');
    }

    // Undo button
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => this.handleUndo());
    }

    // Redo button
    const redoBtn = document.getElementById('redo-btn');
    if (redoBtn) {
      redoBtn.addEventListener('click', () => this.handleRedo());
    }

    // Auto-complete button
    const autoCompleteBtn = document.getElementById('auto-complete-btn');
    if (autoCompleteBtn) {
      autoCompleteBtn.addEventListener('click', () => this.handleAutoComplete());
    }

    // Draw mode selector
    const drawModeSelect = document.getElementById('draw-mode');
    if (drawModeSelect) {
      drawModeSelect.addEventListener('change', (e) => this.handleDrawModeChange(e));
    }

    // Start timer
    this.startTimer();
  }

  /**
   * Handles draw mode change
   */
  handleDrawModeChange(e) {
    const newDrawCount = parseInt(e.target.value);
    const currentDrawCount = this.gameState.drawCount;

    if (newDrawCount !== currentDrawCount) {
      // Always start a new game when changing draw mode
      this.gameState.setDrawCount(newDrawCount);
      this.gameState.dealNewGame();
      this.historyManager.clear();
      this.renderer.renderAll();
      this.updateStats();
      this.updateButtons();
    }
  }

  /**
   * Handles new game
   */
  handleNewGame() {
    console.log('New game button clicked');

    // Only confirm if game has been started and not won
    const shouldConfirm = this.gameState.moveCount > 0 && !this.gameState.gameWon;

    if (shouldConfirm) {
      if (!confirm('Start a new game? Current progress will be lost.')) {
        console.log('New game cancelled');
        return;
      }
    }

    console.log('Starting new game...');
    this.gameState.dealNewGame();
    this.historyManager.clear();
    this.renderer.renderAll();
    this.updateStats();
    this.updateButtons();
    console.log('New game started');
  }

  /**
   * Handles undo
   */
  handleUndo() {
    if (this.historyManager.undo()) {
      this.renderer.renderAll();
      this.updateStats();
      this.updateButtons();
    }
  }

  /**
   * Handles redo
   */
  handleRedo() {
    if (this.historyManager.redo()) {
      this.renderer.renderAll();
      this.updateStats();
      this.updateButtons();
    }
  }

  /**
   * Handles auto-complete
   */
  handleAutoComplete() {
    if (MoveValidator.isAutoCompleteAvailable(this.gameState)) {
      this.historyManager.recordMove();
      this.gameState.autoComplete();
      this.renderer.renderAll();
      this.updateStats();

      if (this.gameState.checkWinCondition()) {
        setTimeout(() => {
          alert(`🎉 You won!\nMoves: ${this.gameState.moveCount}\nTime: ${formatTime(this.gameState.getElapsedTime())}`);
        }, 500);
      }
    } else {
      alert('Auto-complete not available yet. Clear the stock and flip all tableau cards first.');
    }
  }

  /**
   * Starts the timer update loop
   */
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.updateTimer();
      this.updateButtons();
    }, 1000);
  }

  /**
   * Updates the timer display
   */
  updateTimer() {
    const timerEl = document.getElementById('timer');
    if (timerEl) {
      const elapsed = this.gameState.getElapsedTime();
      timerEl.textContent = formatTime(elapsed);
    }
  }

  /**
   * Updates the stats display
   */
  updateStats() {
    const movesEl = document.getElementById('moves');
    if (movesEl) {
      movesEl.textContent = this.gameState.moveCount;
    }
    this.updateTimer();
  }

  /**
   * Updates button states
   */
  updateButtons() {
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
      undoBtn.disabled = !this.historyManager.canUndo();
    }

    const redoBtn = document.getElementById('redo-btn');
    if (redoBtn) {
      redoBtn.disabled = !this.historyManager.canRedo();
    }

    const autoCompleteBtn = document.getElementById('auto-complete-btn');
    if (autoCompleteBtn) {
      autoCompleteBtn.disabled = !MoveValidator.isAutoCompleteAvailable(this.gameState);
    }
  }

  /**
   * Stops the timer
   */
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}
