// Dots and Boxes Game State Manager

import { Board } from './Board.js';

export class GameState {
  constructor(gridSize = 5) {
    this.gridSize = gridSize;
    this.board = new Board(gridSize);
    this.currentPlayer = 'red'; // 'red' or 'blue'
    this.gameOver = false;
    this.winner = null;
    this.moveHistory = [];
    this.scores = {
      red: 0,
      blue: 0
    };
  }

  /**
   * Draws a line
   * @param {string} lineId - Line identifier
   * @returns {object|null} Move result or null if invalid
   */
  drawLine(lineId) {
    if (this.gameOver) {
      return null;
    }

    if (!this.board.drawLine(lineId, this.currentPlayer)) {
      return null;
    }

    // Record move
    this.moveHistory.push({
      lineId,
      player: this.currentPlayer,
      completedBoxes: []
    });

    // Check for completed boxes
    const completedBoxes = this.board.getNewlyCompletedBoxes(lineId, this.currentPlayer);
    const lastMove = this.moveHistory[this.moveHistory.length - 1];
    lastMove.completedBoxes = completedBoxes;

    // Update scores
    if (completedBoxes.length > 0) {
      this.scores[this.currentPlayer] += completedBoxes.length;
    }

    // Check if game is over
    if (this.board.isGameOver()) {
      this.gameOver = true;
      this.determineWinner();
      return {
        lineId,
        completedBoxes,
        gameOver: true,
        winner: this.winner
      };
    }

    // If player completed a box, they get another turn
    // Otherwise, switch players
    if (completedBoxes.length === 0) {
      this.switchPlayer();
    }

    return {
      lineId,
      completedBoxes,
      extraTurn: completedBoxes.length > 0
    };
  }

  /**
   * Switches to the other player
   */
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red';
  }

  /**
   * Determines the winner
   */
  determineWinner() {
    if (this.scores.red > this.scores.blue) {
      this.winner = 'red';
    } else if (this.scores.blue > this.scores.red) {
      this.winner = 'blue';
    } else {
      this.winner = 'draw';
    }
  }

  /**
   * Undoes the last move
   * @returns {boolean} True if undo was successful
   */
  undoMove() {
    if (this.moveHistory.length === 0) {
      return false;
    }

    const lastMove = this.moveHistory.pop();

    // Remove the line
    const line = this.board.lines.get(lastMove.lineId);
    if (line) {
      line.drawn = false;
      line.player = null;
    }

    // Remove completed boxes
    for (const boxId of lastMove.completedBoxes) {
      const box = this.board.boxes.get(boxId);
      if (box) {
        box.completed = false;
        box.owner = null;
        this.scores[lastMove.player]--;
      }
    }

    // Reset game state
    this.gameOver = false;
    this.winner = null;
    this.currentPlayer = lastMove.player;

    return true;
  }

  /**
   * Starts a new game with specified grid size
   * @param {number} gridSize - Grid size (5, 6, or 7)
   */
  newGame(gridSize = null) {
    if (gridSize !== null) {
      this.gridSize = gridSize;
      this.board = new Board(gridSize);
    } else {
      this.board.reset();
    }

    this.currentPlayer = 'red';
    this.gameOver = false;
    this.winner = null;
    this.moveHistory = [];
    this.scores = {
      red: 0,
      blue: 0
    };
  }

  /**
   * Gets available lines (not yet drawn)
   * @returns {Array} Array of line IDs
   */
  getAvailableLines() {
    const available = [];
    for (const [id, line] of this.board.lines) {
      if (!line.drawn) {
        available.push(id);
      }
    }
    return available;
  }

  /**
   * Gets the current board
   * @returns {Board} Current board
   */
  getBoard() {
    return this.board;
  }

  /**
   * Creates a snapshot of current state
   * @returns {object} State snapshot
   */
  createSnapshot() {
    return {
      gridSize: this.gridSize,
      board: this.board.clone(),
      currentPlayer: this.currentPlayer,
      gameOver: this.gameOver,
      winner: this.winner,
      moveHistory: JSON.parse(JSON.stringify(this.moveHistory)),
      scores: { ...this.scores }
    };
  }

  /**
   * Restores state from snapshot
   * @param {object} snapshot - State snapshot
   */
  restoreSnapshot(snapshot) {
    this.gridSize = snapshot.gridSize;
    this.board = snapshot.board.clone();
    this.currentPlayer = snapshot.currentPlayer;
    this.gameOver = snapshot.gameOver;
    this.winner = snapshot.winner;
    this.moveHistory = JSON.parse(JSON.stringify(snapshot.moveHistory));
    this.scores = { ...snapshot.scores };
  }
}
