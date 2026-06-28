// Tap-to-select handler for mobile touch interactions

export class TapHandler {
  constructor(gameState, renderer, historyManager, uiController) {
    this.gameState = gameState;
    this.renderer = renderer;
    this.historyManager = historyManager;
    this.uiController = uiController;
    this.selectedCard = null;
    this.selectedPile = null;
    this.selectedCount = 0;
    this.lastTap = 0;
    this.doubleTapDelay = 300;
  }

  /**
   * Initializes tap event listeners
   */
  initialize() {
    // Stock tap
    this.renderer.elements.stock.addEventListener('click', (e) => {
      this.handleStockTap();
    });

    // Add tap listeners to all piles
    this.renderer.elements.waste.addEventListener('click', (e) => {
      this.handlePileTap(e, 'waste');
    });

    this.renderer.elements.foundations.forEach((el, index) => {
      el.addEventListener('click', (e) => {
        this.handlePileTap(e, 'foundation', index);
      });
    });

    this.renderer.elements.tableaus.forEach((el, index) => {
      el.addEventListener('click', (e) => {
        this.handlePileTap(e, 'tableau', index);
      });
    });
  }

  /**
   * Handles stock pile tap
   */
  handleStockTap() {
    this.clearSelection();
    this.historyManager.recordMove();

    if (this.gameState.stock.canDraw()) {
      this.gameState.drawFromStock();
    } else {
      this.gameState.resetStock();
    }

    this.renderer.renderStock();
    this.renderer.renderWaste();
    if (this.uiController) {
      this.uiController.updateStats();
      this.uiController.updateButtons();
    }
  }

  /**
   * Handles tap on a pile
   */
  handlePileTap(e, pileType, pileIndex = 0) {
    const now = Date.now();
    const isDoubleTap = (now - this.lastTap) < this.doubleTapDelay;
    this.lastTap = now;

    const cardEl = e.target.closest('.card.face-up');

    // Handle double-tap for auto-move to foundation
    if (isDoubleTap && cardEl) {
      this.handleDoubleTap(pileType, pileIndex);
      return;
    }

    // If clicking on a card
    if (cardEl) {
      const cardIndex = parseInt(cardEl.dataset.cardIndex) || 0;
      this.handleCardTap(pileType, pileIndex, cardIndex, cardEl);
    } else {
      // Clicking on empty pile - try to place selected card
      this.handleEmptyPileTap(pileType, pileIndex);
    }
  }

  /**
   * Handles tap on a card
   */
  handleCardTap(pileType, pileIndex, cardIndex, cardEl) {
    const pile = this.gameState.getPile(pileType, pileIndex);

    if (!pile) return;

    // If this is the already selected card, deselect it
    if (this.selectedPile === pile && this.selectedCard === pile.getCards()[cardIndex]) {
      this.clearSelection();
      return;
    }

    // If we have a selection, try to move to this pile
    if (this.selectedCard && this.selectedPile) {
      this.attemptMove(pile);
      return;
    }

    // Otherwise, select this card
    this.selectCard(pile, pileType, pileIndex, cardIndex);
  }

  /**
   * Handles tap on empty pile area
   */
  handleEmptyPileTap(pileType, pileIndex) {
    if (!this.selectedCard || !this.selectedPile) {
      this.clearSelection();
      return;
    }

    const targetPile = this.gameState.getPile(pileType, pileIndex);
    this.attemptMove(targetPile);
  }

  /**
   * Selects a card
   */
  selectCard(pile, pileType, pileIndex, cardIndex) {
    // Can only select from waste (top card), foundation (top card), or tableau (face-up cards)
    if (pileType === 'waste') {
      this.selectedCard = pile.topCard();
      this.selectedPile = pile;
      this.selectedCount = 1;
    } else if (pileType === 'foundation') {
      this.selectedCard = pile.topCard();
      this.selectedPile = pile;
      this.selectedCount = 1;
    } else if (pileType === 'tableau') {
      const cards = pile.getCards();
      // Make sure we're selecting a face-up card and it can be moved
      if (cardIndex >= 0 && cards[cardIndex] && cards[cardIndex].faceUp) {
        if (pile.canMoveFrom(cardIndex)) {
          this.selectedCard = cards[cardIndex];
          this.selectedPile = pile;
          this.selectedCount = cards.length - cardIndex;
        } else {
          return;
        }
      } else {
        return;
      }
    }

    // Visual feedback
    this.renderer.renderAll();
    this.highlightSelectedCard();
  }

  /**
   * Attempts to move selected card(s) to target pile
   */
  attemptMove(targetPile) {
    if (!this.selectedCard || !this.selectedPile || !targetPile) {
      this.clearSelection();
      return;
    }

    this.historyManager.recordMove();

    if (this.gameState.moveCards(this.selectedPile, targetPile, this.selectedCount)) {
      this.clearSelection();
      this.renderer.renderAll();

      if (this.uiController) {
        this.uiController.updateStats();
        this.uiController.updateButtons();
      }

      // Check win condition
      if (this.gameState.checkWinCondition()) {
        this.handleWin();
      }
    } else {
      // Invalid move - just clear selection
      this.clearSelection();
      this.renderer.renderAll();
    }
  }

  /**
   * Handles double-tap to auto-move to foundation
   */
  handleDoubleTap(pileType, pileIndex) {
    const pile = this.gameState.getPile(pileType, pileIndex);
    if (!pile || pile.isEmpty()) return;

    // Only allow double-tap on top card
    const card = pile.topCard();

    this.historyManager.recordMove();

    if (this.gameState.autoMoveToFoundation(card, pile)) {
      this.clearSelection();
      this.renderer.renderAll();

      if (this.uiController) {
        this.uiController.updateStats();
        this.uiController.updateButtons();
      }

      // Check win condition
      if (this.gameState.checkWinCondition()) {
        this.handleWin();
      }
    }
  }

  /**
   * Highlights the selected card
   */
  highlightSelectedCard() {
    if (!this.selectedCard || !this.selectedPile) return;

    // Add selected class to the card element
    const cards = document.querySelectorAll('.card.face-up');
    cards.forEach(cardEl => {
      if (cardEl.dataset.cardId === this.selectedCard.id) {
        cardEl.classList.add('selected');
      }
    });

    // Highlight valid targets
    this.renderer.highlightValidTargets(this.selectedCard, this.selectedCount);
  }

  /**
   * Clears the current selection
   */
  clearSelection() {
    this.selectedCard = null;
    this.selectedPile = null;
    this.selectedCount = 0;

    // Remove visual highlights
    document.querySelectorAll('.card.selected').forEach(el => {
      el.classList.remove('selected');
    });

    this.renderer.clearValidTargets();
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
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}
