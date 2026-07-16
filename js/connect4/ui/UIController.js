// Connect 4 UI Controller

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

    // Back to home button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }

    // Column click handlers
    const clickArea = document.querySelector('.column-click-area');
    if (clickArea) {
      clickArea.addEventListener('click', (e) => {
        const colButton = e.target.closest('.column-button');
        if (colButton) {
          const col = parseInt(colButton.dataset.col);
          this.handleColumnClick(col);
        }
      });
    }

    // Update initial state
    this.updateUI();
  }

  /**
   * Handles column click
   * @param {number} col - Column index
   */
  handleColumnClick(col) {
    if (this.gameState.gameOver) {
      return;
    }

    const result = this.gameState.makeMove(col);
    if (!result) {
      return; // Invalid move
    }

    // Animate drop
    this.renderer.animateDrop(result.row, col, () => {
      // Check for game over
      if (result.win) {
        this.renderer.showGameOver(result.winner);
      } else if (result.draw) {
        this.renderer.showGameOver(null);
      }

      this.updateUI();
    });

    // Update UI immediately (except for the dropped disc which animates)
    this.renderer.updateCurrentPlayer(this.gameState.currentPlayer);
    this.updateButtons();
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
    this.renderer.updateCurrentPlayer(this.gameState.currentPlayer);
    this.renderer.highlightValidColumns();
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
