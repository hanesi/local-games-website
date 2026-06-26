// Card class representing a single playing card

import { SUIT_COLORS } from '../utils/constants.js';

export class Card {
  /**
   * Creates a new Card
   * @param {string} suit - Card suit (♠ ♥ ♦ ♣)
   * @param {string} rank - Card rank (A, 2-10, J, Q, K)
   * @param {boolean} faceUp - Whether card is face up
   */
  constructor(suit, rank, faceUp = false) {
    this.suit = suit;
    this.rank = rank;
    this.faceUp = faceUp;
    this.id = `${rank}${suit}`; // Unique identifier
  }

  /**
   * Gets the color of this card
   * @returns {string} 'red' or 'black'
   */
  get color() {
    return SUIT_COLORS[this.suit];
  }

  /**
   * Flips the card face up
   */
  flip() {
    this.faceUp = true;
  }

  /**
   * Flips the card face down
   */
  flipDown() {
    this.faceUp = false;
  }

  /**
   * Creates a copy of this card
   * @returns {Card} New card instance
   */
  clone() {
    return new Card(this.suit, this.rank, this.faceUp);
  }

  /**
   * String representation of the card
   * @returns {string} Card string (e.g., "A♠")
   */
  toString() {
    return `${this.rank}${this.suit}`;
  }
}
