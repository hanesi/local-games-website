// Dots and Boxes UI Controller

export class UIController {
  constructor(gameState, renderer) {
    this.gameState = gameState;
    this.renderer = renderer;
  }

  /**
   * Initializes UI controls
   */
  initialize() {
    // New Game button
    const newGameBtn = document.getElementById('new-game-btn');
    if (newGameBtn) {
      newGameBtn.addEventListener('click', () => this.handleNewGame());
    }

    // Undo button
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => this.handleUndo());
    }

    // Back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }

    // Grid size selector
    const gridSizeSelect = document.getElementById('grid-size');
    if (gridSizeSelect) {
      gridSizeSelect.addEventListener('change', (e) => this.handleGridSizeChange(e));
    }

    // Line click handlers
    this.boardElement = document.getElementById('board');
    if (this.boardElement) {
      this.boardElement.addEventListener('click', (e) => {
        const lineElement = e.target.closest('.line.available');
        if (lineElement) {
          const lineId = lineElement.dataset.lineId;
          this.handleLineClick(lineId);
        }
      });
    }

    // Update initial state
    this.updateUI();
  }

  /**
   * Handles line click
   * @param {string} lineId - Line identifier
   */
  handleLineClick(lineId) {
    if (this.gameState.gameOver) {
      return;
    }

    const result = this.gameState.drawLine(lineId);
    if (!result) {
      return; // Invalid move
    }

    // Animate line drawing
    this.renderer.animateLine(lineId, () => {
      this.renderer.renderLines();

      // Animate completed boxes if any
      if (result.completedBoxes && result.completedBoxes.length > 0) {
        this.renderer.renderBoxes();
        this.renderer.animateBoxes(result.completedBoxes, () => {
          // Check for game over
          if (result.gameOver) {
            this.renderer.showGameOver();
          }
        });
      } else if (result.gameOver) {
        this.renderer.showGameOver();
      }

      this.updateUI();
    });
  }

  /**
   * Handles new game
   */
  handleNewGame() {
    // Only confirm if game has been started and not finished
    const shouldConfirm = this.gameState.moveHistory.length > 0 && !this.gameState.gameOver;

    if (shouldConfirm && !confirm('Start a new game? Current progress will be lost.')) {
      return;
    }

    this.gameState.newGame();
    this.renderer.hideGameOver();
    this.renderer.initialize();
    this.renderer.renderAll();
    this.updateUI();
  }

  /**
   * Handles grid size change
   * @param {Event} e - Change event
   */
  handleGridSizeChange(e) {
    const newSize = parseInt(e.target.value);

    if (this.gameState.moveHistory.length > 0) {
      if (!confirm('Changing grid size will start a new game. Continue?')) {
        e.target.value = this.gameState.gridSize;
        return;
      }
    }

    this.gameState.newGame(newSize);
    this.renderer.hideGameOver();
    this.renderer.initialize();
    this.renderer.renderAll();
    this.updateUI();
  }

  /**
   * Handles undo
   */
  handleUndo() {
    if (this.gameState.undoMove()) {
      this.renderer.hideGameOver();
      this.renderer.renderAll();
      this.updateUI();
    }
  }

  /**
   * Updates the entire UI
   */
  updateUI() {
    this.renderer.updateScores();
    this.renderer.updateCurrentPlayer();
    this.updateButtons();
  }

  /**
   * Updates button states
   */
  updateButtons() {
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
      undoBtn.disabled = this.gameState.moveHistory.length === 0;
    }
  }
}
