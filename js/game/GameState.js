// Core game state manager for Klondike Solitaire

import { Stock } from './Stock.js';
import { Waste } from './Waste.js';
import { Foundation } from './Foundation.js';
import { Tableau } from './Tableau.js';
import { MoveValidator } from './MoveValidator.js';
import { createDeck, shuffle } from '../utils/helpers.js';
import { ALL_SUITS, DRAW_COUNT } from '../utils/constants.js';

export class GameState {
  constructor() {
    this.stock = new Stock();
    this.waste = new Waste();
    this.foundations = ALL_SUITS.map(suit => new Foundation(suit));
    this.tableaus = Array.from({ length: 7 }, (_, i) => new Tableau(i));

    this.moveCount = 0;
    this.startTime = null;
    this.gameWon = false;
  }

  /**
   * Deals a new game
   */
  dealNewGame() {
    // Clear all piles
    this.stock.clear();
    this.waste.clear();
    this.foundations.forEach(f => f.clear());
    this.tableaus.forEach(t => t.clear());

    // Create and shuffle deck
    const deck = shuffle(createDeck());

    // Deal to tableaus (1 card to first, 2 to second, etc.)
    let deckIndex = 0;
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j <= i; j++) {
        const card = deck[deckIndex++];
        // Last card in each column is face-up
        if (j === i) {
          card.flip();
        }
        this.tableaus[i].addCard(card);
      }
    }

    // Remaining cards go to stock (face-down)
    while (deckIndex < deck.length) {
      this.stock.addCard(deck[deckIndex++]);
    }

    // Reset game state
    this.moveCount = 0;
    this.startTime = null;
    this.gameWon = false;
  }

  /**
   * Draws cards from stock to waste
   */
  drawFromStock() {
    if (this.stock.canDraw()) {
      const cards = this.stock.draw(DRAW_COUNT);
      this.waste.addFromStock(cards);
      this.incrementMoveCount();
      return true;
    }
    return false;
  }

  /**
   * Resets stock from waste pile
   */
  resetStock() {
    if (MoveValidator.canResetStock(this.stock, this.waste)) {
      const cards = this.waste.getAllCards();
      this.stock.reset(cards);
      this.incrementMoveCount();
      return true;
    }
    return false;
  }

  /**
   * Moves card(s) from one pile to another
   * @param {Pile} sourcePile - Source pile
   * @param {Pile} targetPile - Target pile
   * @param {number} cardCount - Number of cards to move
   * @returns {boolean} True if move succeeded
   */
  moveCards(sourcePile, targetPile, cardCount = 1) {
    // Get the cards to move
    const cardsToMove = sourcePile.getCardsFrom(sourcePile.size() - cardCount);
    const bottomCard = cardsToMove[0];

    // Validate move
    if (!MoveValidator.validateMove(bottomCard, sourcePile, targetPile, cardCount)) {
      return false;
    }

    // Execute move
    const movedCards = sourcePile.removeCards(cardCount);
    targetPile.addCards(movedCards);

    // Flip top card in source tableau if needed
    if (sourcePile.type === 'tableau' && !sourcePile.isEmpty()) {
      sourcePile.flipTopCard();
    }

    this.incrementMoveCount();
    return true;
  }

  /**
   * Attempts to automatically move a card to appropriate foundation
   * @param {Card} card - Card to auto-move
   * @param {Pile} sourcePile - Source pile
   * @returns {Foundation|null} Foundation if moved, null otherwise
   */
  autoMoveToFoundation(card, sourcePile) {
    for (const foundation of this.foundations) {
      if (foundation.canAccept(card)) {
        if (this.moveCards(sourcePile, foundation, 1)) {
          return foundation;
        }
      }
    }
    return null;
  }

  /**
   * Performs auto-complete (moves all remaining cards to foundations)
   * @returns {boolean} True if auto-complete was performed
   */
  autoComplete() {
    if (!MoveValidator.isAutoCompleteAvailable(this)) {
      return false;
    }

    let moved = true;
    while (moved) {
      moved = false;

      // Try to move from each tableau
      for (const tableau of this.tableaus) {
        if (!tableau.isEmpty()) {
          const topCard = tableau.topCard();
          if (this.autoMoveToFoundation(topCard, tableau)) {
            moved = true;
          }
        }
      }
    }

    return true;
  }

  /**
   * Checks if game is won
   * @returns {boolean} True if all foundations are complete
   */
  checkWinCondition() {
    const allComplete = this.foundations.every(f => f.isComplete());
    if (allComplete) {
      this.gameWon = true;
    }
    return allComplete;
  }

  /**
   * Increments move counter and starts timer on first move
   */
  incrementMoveCount() {
    if (this.startTime === null) {
      this.startTime = Date.now();
    }
    this.moveCount++;
  }

  /**
   * Gets elapsed time in seconds
   * @returns {number} Seconds since first move
   */
  getElapsedTime() {
    if (this.startTime === null) {
      return 0;
    }
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Gets a pile by type and index
   * @param {string} type - Pile type (stock, waste, foundation, tableau)
   * @param {number} index - Pile index (for foundations and tableaus)
   * @returns {Pile|null} The pile or null
   */
  getPile(type, index = 0) {
    switch (type) {
      case 'stock':
        return this.stock;
      case 'waste':
        return this.waste;
      case 'foundation':
        return this.foundations[index];
      case 'tableau':
        return this.tableaus[index];
      default:
        return null;
    }
  }

  /**
   * Creates a snapshot of current game state
   * @returns {object} State snapshot
   */
  createSnapshot() {
    return {
      stock: this.stock.getCards().map(c => c.clone()),
      waste: this.waste.getCards().map(c => c.clone()),
      foundations: this.foundations.map(f => f.getCards().map(c => c.clone())),
      tableaus: this.tableaus.map(t => t.getCards().map(c => c.clone())),
      moveCount: this.moveCount,
      startTime: this.startTime,
      gameWon: this.gameWon
    };
  }

  /**
   * Restores game state from snapshot
   * @param {object} snapshot - State snapshot
   */
  restoreSnapshot(snapshot) {
    this.stock.cards = snapshot.stock.map(c => c.clone());
    this.waste.cards = snapshot.waste.map(c => c.clone());
    this.foundations.forEach((f, i) => {
      f.cards = snapshot.foundations[i].map(c => c.clone());
    });
    this.tableaus.forEach((t, i) => {
      t.cards = snapshot.tableaus[i].map(c => c.clone());
    });
    this.moveCount = snapshot.moveCount;
    this.startTime = snapshot.startTime;
    this.gameWon = snapshot.gameWon;
  }
}
