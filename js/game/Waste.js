// Waste pile (discard pile) - drawn cards from stock

import { Pile } from './Pile.js';
import { DRAW_COUNT } from '../utils/constants.js';

export class Waste extends Pile {
  constructor() {
    super('waste');
  }

  /**
   * Adds cards from stock to waste (face-up)
   * @param {Card[]} cards - Cards to add
   */
  addFromStock(cards) {
    cards.forEach(card => card.flip());
    this.addCards(cards);
  }

  /**
   * Gets the visible cards in waste (top N or fewer based on draw count)
   * @param {number} drawCount - Number of cards to show (1 or 3)
   * @returns {Card[]} Visible cards
   */
  getVisibleCards(drawCount = DRAW_COUNT) {
    const visibleCount = Math.min(drawCount, this.cards.length);
    return this.cards.slice(-visibleCount);
  }

  /**
   * Gets all cards for resetting stock
   * @returns {Card[]} All waste cards
   */
  getAllCards() {
    const allCards = [...this.cards];
    this.clear();
    return allCards;
  }
}
