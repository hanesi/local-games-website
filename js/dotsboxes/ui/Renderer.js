// Dots and Boxes Renderer

export class Renderer {
  constructor(gameState) {
    this.gameState = gameState;
    this.boardElement = document.getElementById('board');
  }

  /**
   * Initializes the board DOM
   */
  initialize() {
    this.boardElement.innerHTML = '';
    this.boardElement.style.setProperty('--grid-size', this.gameState.gridSize);

    const board = this.gameState.getBoard();

    // Create grid container
    const grid = document.createElement('div');
    grid.className = 'dots-grid';

    // Create all cells (dots, lines, boxes)
    for (let row = 0; row < board.gridSize; row++) {
      for (let col = 0; col < board.gridSize; col++) {
        // Add dot
        const dot = document.createElement('div');
        dot.className = 'dot';
        grid.appendChild(dot);

        // Add horizontal line (except last column)
        if (col < board.gridSize - 1) {
          const hLine = document.createElement('div');
          hLine.className = 'line horizontal';
          hLine.dataset.lineId = `h-${row}-${col}`;
          grid.appendChild(hLine);
        }
      }

      // Add vertical lines and boxes row (except last row)
      if (row < board.gridSize - 1) {
        for (let col = 0; col < board.gridSize; col++) {
          // Add vertical line
          const vLine = document.createElement('div');
          vLine.className = 'line vertical';
          vLine.dataset.lineId = `v-${row}-${col}`;
          grid.appendChild(vLine);

          // Add box (except last column)
          if (col < board.gridSize - 1) {
            const box = document.createElement('div');
            box.className = 'box-cell';
            box.dataset.boxId = `box-${row}-${col}`;
            grid.appendChild(box);
          }
        }
      }
    }

    this.boardElement.appendChild(grid);
  }

  /**
   * Renders the entire board
   */
  renderAll() {
    this.renderLines();
    this.renderBoxes();
  }

  /**
   * Renders all lines
   */
  renderLines() {
    const board = this.gameState.getBoard();

    for (const [lineId, line] of board.lines) {
      const lineElement = this.boardElement.querySelector(`[data-line-id="${lineId}"]`);
      if (!lineElement) continue;

      if (line.drawn) {
        lineElement.classList.add('drawn', line.player);
        lineElement.classList.remove('available');
      } else {
        lineElement.classList.remove('drawn', 'red', 'blue');
        if (!this.gameState.gameOver) {
          lineElement.classList.add('available');
        }
      }
    }
  }

  /**
   * Renders all boxes
   */
  renderBoxes() {
    const board = this.gameState.getBoard();

    for (const [boxId, box] of board.boxes) {
      const boxElement = this.boardElement.querySelector(`[data-box-id="${boxId}"]`);
      if (!boxElement) continue;

      if (box.completed) {
        boxElement.classList.add('completed', box.owner);
      } else {
        boxElement.classList.remove('completed', 'red', 'blue');
      }
    }
  }

  /**
   * Animates a line being drawn
   * @param {string} lineId - Line identifier
   * @param {Function} callback - Callback after animation
   */
  animateLine(lineId, callback) {
    const lineElement = this.boardElement.querySelector(`[data-line-id="${lineId}"]`);
    if (!lineElement) return;

    lineElement.classList.add('animating');

    setTimeout(() => {
      lineElement.classList.remove('animating');
      if (callback) callback();
    }, 300);
  }

  /**
   * Animates box completion
   * @param {Array} boxIds - Box identifiers
   * @param {Function} callback - Callback after animation
   */
  animateBoxes(boxIds, callback) {
    if (boxIds.length === 0) {
      if (callback) callback();
      return;
    }

    boxIds.forEach((boxId, index) => {
      const boxElement = this.boardElement.querySelector(`[data-box-id="${boxId}"]`);
      if (boxElement) {
        setTimeout(() => {
          boxElement.classList.add('pop-in');
        }, index * 100);
      }
    });

    setTimeout(() => {
      boxIds.forEach(boxId => {
        const boxElement = this.boardElement.querySelector(`[data-box-id="${boxId}"]`);
        if (boxElement) {
          boxElement.classList.remove('pop-in');
        }
      });
      if (callback) callback();
    }, boxIds.length * 100 + 300);
  }

  /**
   * Updates score display
   */
  updateScores() {
    const redScore = document.getElementById('red-score');
    const blueScore = document.getElementById('blue-score');

    if (redScore) redScore.textContent = this.gameState.scores.red;
    if (blueScore) blueScore.textContent = this.gameState.scores.blue;
  }

  /**
   * Updates current player indicator
   */
  updateCurrentPlayer() {
    const indicator = document.getElementById('current-player');
    if (indicator) {
      const playerName = this.gameState.currentPlayer === 'red' ? 'Red' : 'Blue';
      indicator.textContent = playerName;
      indicator.className = `player-indicator ${this.gameState.currentPlayer}`;
    }
  }

  /**
   * Shows game over message
   */
  showGameOver() {
    const messageEl = document.getElementById('game-message');
    if (!messageEl) return;

    const winner = this.gameState.winner;
    const totalBoxes = this.gameState.board.getTotalBoxes();

    if (winner === 'draw') {
      messageEl.textContent = `It's a Draw! ${this.gameState.scores.red}-${this.gameState.scores.blue}`;
      messageEl.className = 'game-message draw';
    } else {
      const playerName = winner === 'red' ? 'Red' : 'Blue';
      messageEl.textContent = `🎉 ${playerName} Wins! ${this.gameState.scores[winner]}-${this.gameState.scores[winner === 'red' ? 'blue' : 'red']}`;
      messageEl.className = `game-message ${winner}`;
    }

    messageEl.style.display = 'block';
  }

  /**
   * Hides game over message
   */
  hideGameOver() {
    const messageEl = document.getElementById('game-message');
    if (messageEl) {
      messageEl.style.display = 'none';
    }
  }
}
