// Connect 4 Board class

export class Board {
  constructor() {
    this.rows = 6;
    this.cols = 7;
    this.grid = this.createEmptyGrid();
  }

  /**
   * Creates an empty game board
   * @returns {Array} 2D array representing the board
   */
  createEmptyGrid() {
    return Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(null)
    );
  }

  /**
   * Drops a disc in the specified column
   * @param {number} col - Column index (0-6)
   * @param {string} player - Player color ('red' or 'yellow')
   * @returns {number|null} Row where disc landed, or null if column full
   */
  dropDisc(col, player) {
    // Find lowest empty row in this column
    for (let row = this.rows - 1; row >= 0; row--) {
      if (this.grid[row][col] === null) {
        this.grid[row][col] = player;
        return row;
      }
    }
    return null; // Column is full
  }

  /**
   * Checks if a column can accept another disc
   * @param {number} col - Column index
   * @returns {boolean} True if column has space
   */
  canDropInColumn(col) {
    return this.grid[0][col] === null;
  }

  /**
   * Gets the cell value at row, col
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {string|null} Player color or null
   */
  getCell(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return null;
    }
    return this.grid[row][col];
  }

  /**
   * Checks for a winner starting from the last move
   * @param {number} row - Row of last move
   * @param {number} col - Column of last move
   * @returns {object|null} Win info or null
   */
  checkWin(row, col) {
    const player = this.grid[row][col];
    if (!player) return null;

    // Check all four directions
    const directions = [
      { dr: 0, dc: 1 },  // Horizontal
      { dr: 1, dc: 0 },  // Vertical
      { dr: 1, dc: 1 },  // Diagonal \
      { dr: 1, dc: -1 }  // Diagonal /
    ];

    for (const { dr, dc } of directions) {
      const cells = this.getConnectedCells(row, col, dr, dc, player);
      if (cells.length >= 4) {
        return {
          player,
          cells,
          direction: { dr, dc }
        };
      }
    }

    return null;
  }

  /**
   * Gets all connected cells in a direction
   * @param {number} row - Starting row
   * @param {number} col - Starting column
   * @param {number} dr - Row direction
   * @param {number} dc - Column direction
   * @param {string} player - Player to match
   * @returns {Array} Connected cell coordinates
   */
  getConnectedCells(row, col, dr, dc, player) {
    const cells = [[row, col]];

    // Check positive direction
    let r = row + dr;
    let c = col + dc;
    while (this.getCell(r, c) === player) {
      cells.push([r, c]);
      r += dr;
      c += dc;
    }

    // Check negative direction
    r = row - dr;
    c = col - dc;
    while (this.getCell(r, c) === player) {
      cells.unshift([r, c]);
      r -= dr;
      c -= dc;
    }

    return cells;
  }

  /**
   * Checks if the board is full (draw)
   * @returns {boolean} True if board is full
   */
  isFull() {
    return this.grid[0].every(cell => cell !== null);
  }

  /**
   * Resets the board
   */
  reset() {
    this.grid = this.createEmptyGrid();
  }

  /**
   * Creates a copy of the board
   * @returns {Board} New board instance
   */
  clone() {
    const newBoard = new Board();
    newBoard.grid = this.grid.map(row => [...row]);
    return newBoard;
  }
}
