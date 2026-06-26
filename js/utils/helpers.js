// Utility functions for Klondike Solitaire

import { ALL_SUITS, ALL_RANKS, SUIT_COLORS, COLORS, RANK_VALUES } from './constants.js';
import { Card } from '../game/Card.js';

/**
 * Creates a standard 52-card deck
 * @returns {Card[]} Array of Card objects
 */
export function createDeck() {
  const deck = [];

  for (const suit of ALL_SUITS) {
    for (const rank of ALL_RANKS) {
      deck.push(new Card(suit, rank));
    }
  }

  return deck;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffle(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Gets the color of a card based on its suit
 * @param {Card} card - Card to check
 * @returns {string} 'red' or 'black'
 */
export function getCardColor(card) {
  return SUIT_COLORS[card.suit];
}

/**
 * Gets the numeric value of a card rank
 * @param {string} rank - Card rank (A, 2-10, J, Q, K)
 * @returns {number} Numeric value (1-13)
 */
export function getRankValue(rank) {
  return RANK_VALUES[rank];
}

/**
 * Checks if two cards are opposite colors
 * @param {Card} card1 - First card
 * @param {Card} card2 - Second card
 * @returns {boolean} True if opposite colors
 */
export function areOppositeColors(card1, card2) {
  return getCardColor(card1) !== getCardColor(card2);
}

/**
 * Formats time in seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Checks if a rank is one less than another
 * @param {string} rank1 - First rank
 * @param {string} rank2 - Second rank
 * @returns {boolean} True if rank1 is one less than rank2
 */
export function isOneLess(rank1, rank2) {
  return getRankValue(rank1) === getRankValue(rank2) - 1;
}

/**
 * Checks if a rank is one more than another
 * @param {string} rank1 - First rank
 * @param {string} rank2 - Second rank
 * @returns {boolean} True if rank1 is one more than rank2
 */
export function isOneMore(rank1, rank2) {
  return getRankValue(rank1) === getRankValue(rank2) + 1;
}
