// History manager for undo/redo functionality

export class HistoryManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Records a state snapshot before a move
   */
  recordMove() {
    const snapshot = this.gameState.createSnapshot();
    this.undoStack.push(snapshot);
    // Clear redo stack when new move is made
    this.redoStack = [];
  }

  /**
   * Undoes the last move
   * @returns {boolean} True if undo was performed
   */
  undo() {
    if (this.undoStack.length === 0) {
      return false;
    }

    // Save current state to redo stack
    const currentSnapshot = this.gameState.createSnapshot();
    this.redoStack.push(currentSnapshot);

    // Restore previous state
    const previousSnapshot = this.undoStack.pop();
    this.gameState.restoreSnapshot(previousSnapshot);

    return true;
  }

  /**
   * Redoes the last undone move
   * @returns {boolean} True if redo was performed
   */
  redo() {
    if (this.redoStack.length === 0) {
      return false;
    }

    // Save current state to undo stack
    const currentSnapshot = this.gameState.createSnapshot();
    this.undoStack.push(currentSnapshot);

    // Restore next state
    const nextSnapshot = this.redoStack.pop();
    this.gameState.restoreSnapshot(nextSnapshot);

    return true;
  }

  /**
   * Clears all history
   */
  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Checks if undo is available
   * @returns {boolean} True if can undo
   */
  canUndo() {
    return this.undoStack.length > 0;
  }

  /**
   * Checks if redo is available
   * @returns {boolean} True if can redo
   */
  canRedo() {
    return this.redoStack.length > 0;
  }
}
