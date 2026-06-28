// Connect 4 DOM Renderer

export class Renderer {
  constructor(gameState) {
    this.gameState = gameState;
    this.boardElement = document.getElementById('board');
    this.cells = [];
  }

  /**
   * Initializes the board DOM
   */
  initialize() {
    this.boardElement.innerHTML = '';
    this.cells = [];

    const board = this.gameState.getBoard();

    // Create grid
    for (let row = 0; row < board.rows; row++) {
      const rowCells = [];
      for (let col = 0; col < board.cols; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;

        const disc = document.createElement('div');
        disc.className = 'disc empty';
        cell.appendChild(disc);

        this.boardElement.appendChild(cell);
        rowCells.push(cell);
      }
      this.cells.push(rowCells);
    }

    // Create column click areas
    this.createColumnClickAreas();
  }

  /**
   * Creates clickable areas above each column
   */
  createColumnClickAreas() {
    const clickArea = document.createElement('div');
    clickArea.className = 'column-click-area';

    const board = this.gameState.getBoard();
    for (let col = 0; col < board.cols; col++) {
      const colButton = document.createElement('div');
      colButton.className = 'column-button';
      colButton.dataset.col = col;
      clickArea.appendChild(colButton);
    }

    this.boardElement.parentElement.insertBefore(clickArea, this.boardElement);
  }

  /**
   * Renders the entire board
   */
  renderAll() {
    const board = this.gameState.getBoard();

    for (let row = 0; row < board.rows; row++) {
      for (let col = 0; col < board.cols; col++) {
        this.renderCell(row, col);
      }
    }
  }

  /**
   * Renders a single cell
   * @param {number} row - Row index
   * @param {number} col - Column index
   */
  renderCell(row, col) {
    const board = this.gameState.getBoard();
    const cellValue = board.getCell(row, col);
    const cellElement = this.cells[row][col];
    const disc = cellElement.querySelector('.disc');

    // Remove all classes
    disc.className = 'disc';

    if (cellValue) {
      disc.classList.add(cellValue);

      // Highlight winning cells
      if (this.gameState.isWinningCell(row, col)) {
        disc.classList.add('winning');
      }
    } else {
      disc.classList.add('empty');
    }
  }

  /**
   * Animates a disc drop
   * @param {number} row - Target row
   * @param {number} col - Target column
   * @param {Function} callback - Callback after animation
   */
  animateDrop(row, col, callback) {
    const cellElement = this.cells[row][col];
    const disc = cellElement.querySelector('.disc');

    // Add animation class
    disc.classList.add('dropping');

    // Render after animation
    setTimeout(() => {
      disc.classList.remove('dropping');
      this.renderCell(row, col);
      if (callback) callback();
    }, 400);
  }

  /**
   * Highlights valid columns
   */
  highlightValidColumns() {
    const board = this.gameState.getBoard();
    const columnButtons = document.querySelectorAll('.column-button');

    columnButtons.forEach((btn, col) => {
      if (board.canDropInColumn(col) && !this.gameState.gameOver) {
        btn.classList.add('valid');
      } else {
        btn.classList.remove('valid');
      }
    });
  }

  /**
   * Updates current player indicator
   * @param {string} player - Current player ('red' or 'yellow')
   */
  updateCurrentPlayer(player) {
    const indicator = document.getElementById('current-player');
    if (indicator) {
      indicator.textContent = player === 'red' ? 'Red' : 'Yellow';
      indicator.className = `player-indicator ${player}`;
    }
  }

  /**
   * Shows game over message
   * @param {string} winner - Winner ('red', 'yellow', or null for draw)
   */
  showGameOver(winner) {
    const messageEl = document.getElementById('game-message');
    if (messageEl) {
      if (winner) {
        const playerName = winner === 'red' ? 'Red' : 'Yellow';
        messageEl.textContent = `🎉 ${playerName} Wins!`;
        messageEl.className = `game-message ${winner}`;
      } else {
        messageEl.textContent = "It's a Draw!";
        messageEl.className = 'game-message draw';
      }
      messageEl.style.display = 'block';
    }
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
