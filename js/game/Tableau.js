// Tableau pile - cascading columns in main play area

import { Pile } from './Pile.js';
import { RANKS } from '../utils/constants.js';
import { areOppositeColors, getRankValue } from '../utils/helpers.js';

export class Tableau extends Pile {
  /**
   * Creates a new Tableau pile
   * @param {number} index - Column index (0-6)
   */
  constructor(index) {
    super('tableau');
    this.index = index;
  }

  /**
   * Checks if a card can be placed on this tableau
   * @param {Card} card - Card to check
   * @returns {boolean} True if card can be placed
   */
  canAccept(card) {
    // If empty, only Kings can be placed
    if (this.isEmpty()) {
      return card.rank === RANKS.KING;
    }

    const topCard = this.topCard();

    // Top card must be face-up
    if (!topCard.faceUp) {
      return false;
    }

    // Must be opposite color
    if (!areOppositeColors(card, topCard)) {
      return false;
    }

    // Must be one rank lower
    return getRankValue(card.rank) === getRankValue(topCard.rank) - 1;
  }

  /**
   * Checks if cards starting at index can be moved together
   * @param {number} startIndex - Starting index
   * @returns {boolean} True if cards can be moved
   */
  canMoveFrom(startIndex) {
    if (startIndex < 0 || startIndex >= this.cards.length) {
      return false;
    }

    // First card must be face-up
    if (!this.cards[startIndex].faceUp) {
      return false;
    }

    // Check that subsequent cards form valid sequence
    for (let i = startIndex; i < this.cards.length - 1; i++) {
      const current = this.cards[i];
      const next = this.cards[i + 1];

      // Next must be face-up, opposite color, and one rank lower
      if (!next.faceUp ||
          !areOppositeColors(current, next) ||
          getRankValue(next.rank) !== getRankValue(current.rank) - 1) {
        return false;
      }
    }

    return true;
  }

  /**
   * Gets the first face-up card index
   * @returns {number} Index of first face-up card, or -1 if none
   */
  getFirstFaceUpIndex() {
    return this.cards.findIndex(card => card.faceUp);
  }

  /**
   * Gets all face-up cards
   * @returns {Card[]} Face-up cards
   */
  getFaceUpCards() {
    return this.cards.filter(card => card.faceUp);
  }

  /**
   * Flips the top face-down card if any
   */
  flipTopCard() {
    if (!this.isEmpty()) {
      const top = this.topCard();
      if (!top.faceUp) {
        top.flip();
      }
    }
  }
}
