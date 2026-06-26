// Foundation pile - builds suit sequences from Ace to King

import { Pile } from './Pile.js';
import { RANKS } from '../utils/constants.js';

export class Foundation extends Pile {
  /**
   * Creates a new Foundation pile
   * @param {string} suit - The suit this foundation accepts (♠ ♥ ♦ ♣)
   */
  constructor(suit) {
    super('foundation');
    this.suit = suit;
  }

  /**
   * Checks if a card can be added to this foundation
   * @param {Card} card - Card to check
   * @returns {boolean} True if card can be added
   */
  canAccept(card) {
    // Must match foundation's suit
    if (card.suit !== this.suit) {
      return false;
    }

    // If empty, only accept Ace
    if (this.isEmpty()) {
      return card.rank === RANKS.ACE;
    }

    // Otherwise, must be next rank in sequence
    const topCard = this.topCard();
    const topValue = this.getRankValue(topCard.rank);
    const cardValue = this.getRankValue(card.rank);

    return cardValue === topValue + 1;
  }

  /**
   * Gets numeric value of a rank
   * @param {string} rank - Card rank
   * @returns {number} Numeric value (1-13)
   */
  getRankValue(rank) {
    const values = {
      'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
      '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
    };
    return values[rank];
  }

  /**
   * Checks if foundation is complete (has all 13 cards)
   * @returns {boolean} True if complete
   */
  isComplete() {
    return this.size() === 13;
  }
}
