// Stock pile (draw pile) - face-down deck to draw from

import { Pile } from './Pile.js';

export class Stock extends Pile {
  constructor() {
    super('stock');
  }

  /**
   * Draws cards from the stock (always face-down in stock)
   * @param {number} count - Number of cards to draw
   * @returns {Card[]} Drawn cards
   */
  draw(count) {
    const drawCount = Math.min(count, this.cards.length);
    return this.removeCards(drawCount);
  }

  /**
   * Checks if stock can be reset (has cards to draw)
   * @returns {boolean} True if stock has cards
   */
  canDraw() {
    return !this.isEmpty();
  }

  /**
   * Resets the stock with cards from waste pile
   * @param {Card[]} cards - Cards to add back to stock (from waste)
   */
  reset(cards) {
    // Cards go back face-down
    cards.forEach(card => card.flipDown());
    this.cards = cards.reverse(); // Reverse to maintain order
  }
}
