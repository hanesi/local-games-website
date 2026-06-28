// Connect 4 Game State Manager

import { Board } from './Board.js';

export class GameState {
  constructor() {
    this.board = new Board();
    this.currentPlayer = 'red'; // 'red' or 'yellow'
    this.gameOver = false;
    this.winner = null;
    this.winningCells = [];
    this.moveHistory = [];
  }

  /**
   * Drops a disc in the specified column
   * @param {number} col - Column index (0-6)
   * @returns {object|null} Move result or null if invalid
   */
  makeMove(col) {
    if (this.gameOver) {
      return null;
    }

    if (!this.board.canDropInColumn(col)) {
      return null;
    }

    const row = this.board.dropDisc(col, this.currentPlayer);
    if (row === null) {
      return null;
    }

    // Record move
    this.moveHistory.push({ row, col, player: this.currentPlayer });

    // Check for win
    const winInfo = this.board.checkWin(row, col);
    if (winInfo) {
      this.gameOver = true;
      this.winner = winInfo.player;
      this.winningCells = winInfo.cells;
      return { row, col, win: true, winner: this.winner };
    }

    // Check for draw
    if (this.board.isFull()) {
      this.gameOver = true;
      return { row, col, draw: true };
    }

    // Switch player
    this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';

    return { row, col };
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
    this.board.grid[lastMove.row][lastMove.col] = null;

    // Reset game state
    this.gameOver = false;
    this.winner = null;
    this.winningCells = [];
    this.currentPlayer = lastMove.player;

    return true;
  }

  /**
   * Starts a new game
   */
  newGame() {
    this.board.reset();
    this.currentPlayer = 'red';
    this.gameOver = false;
    this.winner = null;
    this.winningCells = [];
    this.moveHistory = [];
  }

  /**
   * Checks if a cell is part of the winning combination
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean} True if cell is in winning combination
   */
  isWinningCell(row, col) {
    return this.winningCells.some(([r, c]) => r === row && c === col);
  }

  /**
   * Gets the current board state
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
      board: this.board.clone(),
      currentPlayer: this.currentPlayer,
      gameOver: this.gameOver,
      winner: this.winner,
      winningCells: [...this.winningCells],
      moveHistory: [...this.moveHistory]
    };
  }

  /**
   * Restores state from snapshot
   * @param {object} snapshot - State snapshot
   */
  restoreSnapshot(snapshot) {
    this.board = snapshot.board.clone();
    this.currentPlayer = snapshot.currentPlayer;
    this.gameOver = snapshot.gameOver;
    this.winner = snapshot.winner;
    this.winningCells = [...snapshot.winningCells];
    this.moveHistory = [...snapshot.moveHistory];
  }
}
