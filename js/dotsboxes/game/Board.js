// Dots and Boxes Board class

export class Board {
  constructor(gridSize = 5) {
    this.gridSize = gridSize; // Number of dots per row/column
    this.lines = this.createLines();
    this.boxes = this.createBoxes();
  }

  /**
   * Creates all possible lines
   * @returns {Map} Map of line IDs to line objects
   */
  createLines() {
    const lines = new Map();

    // Horizontal lines
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize - 1; col++) {
        const id = `h-${row}-${col}`;
        lines.set(id, {
          id,
          type: 'horizontal',
          row,
          col,
          drawn: false,
          player: null
        });
      }
    }

    // Vertical lines
    for (let row = 0; row < this.gridSize - 1; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const id = `v-${row}-${col}`;
        lines.set(id, {
          id,
          type: 'vertical',
          row,
          col,
          drawn: false,
          player: null
        });
      }
    }

    return lines;
  }

  /**
   * Creates all boxes
   * @returns {Map} Map of box IDs to box objects
   */
  createBoxes() {
    const boxes = new Map();

    for (let row = 0; row < this.gridSize - 1; row++) {
      for (let col = 0; col < this.gridSize - 1; col++) {
        const id = `box-${row}-${col}`;
        boxes.set(id, {
          id,
          row,
          col,
          completed: false,
          owner: null,
          sides: {
            top: `h-${row}-${col}`,
            bottom: `h-${row + 1}-${col}`,
            left: `v-${row}-${col}`,
            right: `v-${row}-${col + 1}`
          }
        });
      }
    }

    return boxes;
  }

  /**
   * Draws a line
   * @param {string} lineId - Line identifier
   * @param {string} player - Player who drew the line ('red' or 'blue')
   * @returns {boolean} True if line was drawn successfully
   */
  drawLine(lineId, player) {
    const line = this.lines.get(lineId);
    if (!line || line.drawn) {
      return false;
    }

    line.drawn = true;
    line.player = player;
    return true;
  }

  /**
   * Checks if a line is drawn
   * @param {string} lineId - Line identifier
   * @returns {boolean} True if line is drawn
   */
  isLineDrawn(lineId) {
    const line = this.lines.get(lineId);
    return line ? line.drawn : false;
  }

  /**
   * Gets newly completed boxes after drawing a line
   * @param {string} lineId - Line that was just drawn
   * @param {string} player - Player who drew the line
   * @returns {Array} Array of newly completed box IDs
   */
  getNewlyCompletedBoxes(lineId, player) {
    const completedBoxes = [];

    // Check all boxes that include this line
    for (const [boxId, box] of this.boxes) {
      if (box.completed) continue;

      // Check if this line is part of this box
      const sides = Object.values(box.sides);
      if (!sides.includes(lineId)) continue;

      // Check if all sides are now drawn
      if (this.isBoxComplete(boxId)) {
        box.completed = true;
        box.owner = player;
        completedBoxes.push(boxId);
      }
    }

    return completedBoxes;
  }

  /**
   * Checks if a box is complete
   * @param {string} boxId - Box identifier
   * @returns {boolean} True if all sides are drawn
   */
  isBoxComplete(boxId) {
    const box = this.boxes.get(boxId);
    if (!box) return false;

    return Object.values(box.sides).every(lineId => this.isLineDrawn(lineId));
  }

  /**
   * Gets the score for a player
   * @param {string} player - Player color
   * @returns {number} Number of boxes owned
   */
  getScore(player) {
    let score = 0;
    for (const box of this.boxes.values()) {
      if (box.owner === player) {
        score++;
      }
    }
    return score;
  }

  /**
   * Checks if the game is over (all lines drawn)
   * @returns {boolean} True if game is over
   */
  isGameOver() {
    for (const line of this.lines.values()) {
      if (!line.drawn) {
        return false;
      }
    }
    return true;
  }

  /**
   * Gets total number of boxes
   * @returns {number} Total boxes
   */
  getTotalBoxes() {
    return (this.gridSize - 1) * (this.gridSize - 1);
  }

  /**
   * Resets the board
   */
  reset() {
    this.lines = this.createLines();
    this.boxes = this.createBoxes();
  }

  /**
   * Creates a copy of the board
   * @returns {Board} New board instance
   */
  clone() {
    const newBoard = new Board(this.gridSize);

    // Clone lines
    for (const [id, line] of this.lines) {
      newBoard.lines.set(id, { ...line });
    }

    // Clone boxes
    for (const [id, box] of this.boxes) {
      newBoard.boxes.set(id, {
        ...box,
        sides: { ...box.sides }
      });
    }

    return newBoard;
  }
}
