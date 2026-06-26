// Drag-and-drop event handling

export class DragDropHandler {
  constructor(gameState, renderer, historyManager, animationManager) {
    this.gameState = gameState;
    this.renderer = renderer;
    this.historyManager = historyManager;
    this.animationManager = animationManager;
    this.draggedCard = null;
    this.draggedFrom = null;
    this.draggedCount = 0;
  }

  /**
   * Initializes drag-and-drop event listeners
   */
  initialize() {
    // Stock click
    this.renderer.elements.stock.addEventListener('click', (e) => {
      this.handleStockClick();
    });

    // Waste double-click to auto-move
    this.renderer.elements.waste.addEventListener('dblclick', (e) => {
      this.handleDoubleClick(e);
    });

    // Foundation double-click
    this.renderer.elements.foundations.forEach(el => {
      el.addEventListener('dblclick', (e) => {
        this.handleDoubleClick(e);
      });
    });

    // Tableau double-click
    this.renderer.elements.tableaus.forEach(el => {
      el.addEventListener('dblclick', (e) => {
        this.handleDoubleClick(e);
      });
    });

    // Setup drag-and-drop on document
    document.addEventListener('dragstart', (e) => this.handleDragStart(e));
    document.addEventListener('dragover', (e) => this.handleDragOver(e));
    document.addEventListener('drop', (e) => this.handleDrop(e));
    document.addEventListener('dragend', (e) => this.handleDragEnd(e));
  }

  /**
   * Handles stock pile click (draw or reset)
   */
  handleStockClick() {
    this.historyManager.recordMove();

    if (this.gameState.stock.canDraw()) {
      this.gameState.drawFromStock();
    } else {
      this.gameState.resetStock();
    }

    this.renderer.renderStock();
    this.renderer.renderWaste();
  }

  /**
   * Handles double-click to auto-move card to foundation
   * @param {Event} e - Double-click event
   */
  handleDoubleClick(e) {
    const cardEl = e.target.closest('.card.face-up');
    if (!cardEl) return;

    const pileType = cardEl.dataset.pileType;
    const pileIndex = parseInt(cardEl.dataset.pileIndex) || 0;

    let sourcePile;
    if (pileType === 'waste') {
      sourcePile = this.gameState.waste;
    } else if (pileType === 'foundation') {
      sourcePile = this.gameState.foundations[pileIndex];
    } else if (pileType === 'tableau') {
      sourcePile = this.gameState.tableaus[pileIndex];
      // Only allow double-click on top card
      const cardIndex = parseInt(cardEl.dataset.cardIndex);
      if (cardIndex !== sourcePile.size() - 1) return;
    }

    if (!sourcePile || sourcePile.isEmpty()) return;

    const card = sourcePile.topCard();
    this.historyManager.recordMove();

    if (this.gameState.autoMoveToFoundation(card, sourcePile)) {
      this.renderer.renderAll();

      // Check win condition
      if (this.gameState.checkWinCondition()) {
        this.handleWin();
      }
    }
  }

  /**
   * Handles drag start event
   * @param {DragEvent} e - Drag event
   */
  handleDragStart(e) {
    const cardEl = e.target.closest('.card');
    if (!cardEl || !cardEl.draggable) return;

    const pileType = cardEl.dataset.pileType;
    const pileIndex = parseInt(cardEl.dataset.pileIndex) || 0;
    const cardIndex = parseInt(cardEl.dataset.cardIndex) || 0;

    // Determine source pile and card count
    if (pileType === 'waste') {
      this.draggedFrom = this.gameState.waste;
      this.draggedCount = 1;
      this.draggedCard = this.draggedFrom.topCard();
    } else if (pileType === 'foundation') {
      this.draggedFrom = this.gameState.foundations[pileIndex];
      this.draggedCount = 1;
      this.draggedCard = this.draggedFrom.topCard();
    } else if (pileType === 'tableau') {
      this.draggedFrom = this.gameState.tableaus[pileIndex];
      const cards = this.draggedFrom.getCards();
      this.draggedCount = cards.length - cardIndex;
      this.draggedCard = cards[cardIndex];
    }

    if (this.draggedCard) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', this.draggedCard.id);
      cardEl.classList.add('dragging');

      // Highlight valid targets
      this.renderer.highlightValidTargets(this.draggedCard, this.draggedCount);
    }
  }

  /**
   * Handles drag over event
   * @param {DragEvent} e - Drag event
   */
  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  /**
   * Handles drop event
   * @param {DragEvent} e - Drop event
   */
  handleDrop(e) {
    e.preventDefault();

    if (!this.draggedCard) return;

    const dropTarget = e.target.closest('[data-pile-type]');
    if (!dropTarget) return;

    const targetType = dropTarget.dataset.pileType;
    const targetIndex = parseInt(dropTarget.dataset.pileIndex) || 0;

    let targetPile;
    if (targetType === 'foundation') {
      targetPile = this.gameState.foundations[targetIndex];
    } else if (targetType === 'tableau') {
      targetPile = this.gameState.tableaus[targetIndex];
    }

    if (targetPile && targetPile !== this.draggedFrom) {
      this.historyManager.recordMove();

      if (this.gameState.moveCards(this.draggedFrom, targetPile, this.draggedCount)) {
        this.renderer.renderAll();

        // Check win condition
        if (this.gameState.checkWinCondition()) {
          this.handleWin();
        }
      }
    }
  }

  /**
   * Handles drag end event
   * @param {DragEvent} e - Drag event
   */
  handleDragEnd(e) {
    const cardEl = e.target.closest('.card');
    if (cardEl) {
      cardEl.classList.remove('dragging');
    }

    this.renderer.clearValidTargets();
    this.draggedCard = null;
    this.draggedFrom = null;
    this.draggedCount = 0;
  }

  /**
   * Handles win condition
   */
  handleWin() {
    setTimeout(() => {
      alert(`🎉 You won!\nMoves: ${this.gameState.moveCount}\nTime: ${this.formatTime(this.gameState.getElapsedTime())}`);
    }, 500);
  }

  /**
   * Formats time in MM:SS
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}
