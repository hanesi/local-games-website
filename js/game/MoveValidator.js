// Move validation logic for Klondike Solitaire

import { RANKS } from '../utils/constants.js';
import { areOppositeColors, getRankValue } from '../utils/helpers.js';

export class MoveValidator {
  /**
   * Validates a move from one pile to another
   * @param {Card} card - Card being moved (bottom card of selection)
   * @param {Pile} sourcePile - Source pile
   * @param {Pile} targetPile - Target pile
   * @param {number} cardCount - Number of cards being moved
   * @returns {boolean} True if move is valid
   */
  static validateMove(card, sourcePile, targetPile, cardCount = 1) {
    if (!card || !sourcePile || !targetPile) {
      return false;
    }

    // Can't move to same pile
    if (sourcePile === targetPile) {
      return false;
    }

    // Validate based on target pile type
    switch (targetPile.type) {
      case 'foundation':
        return this.validateFoundationMove(card, targetPile, cardCount);
      case 'tableau':
        return this.validateTableauMove(card, targetPile, cardCount);
      default:
        return false;
    }
  }

  /**
   * Validates move to foundation
   * @param {Card} card - Card to move
   * @param {Foundation} foundation - Target foundation
   * @param {number} cardCount - Number of cards (must be 1)
   * @returns {boolean} True if valid
   */
  static validateFoundationMove(card, foundation, cardCount) {
    // Can only move single cards to foundation
    if (cardCount !== 1) {
      return false;
    }

    return foundation.canAccept(card);
  }

  /**
   * Validates move to tableau
   * @param {Card} card - Bottom card being moved
   * @param {Tableau} tableau - Target tableau
   * @param {number} cardCount - Number of cards being moved
   * @returns {boolean} True if valid
   */
  static validateTableauMove(card, tableau, cardCount) {
    return tableau.canAccept(card);
  }

  /**
   * Validates stock draw action
   * @param {Stock} stock - Stock pile
   * @returns {boolean} True if can draw
   */
  static canDrawFromStock(stock) {
    return stock.canDraw();
  }

  /**
   * Validates stock reset action
   * @param {Stock} stock - Stock pile
   * @param {Waste} waste - Waste pile
   * @returns {boolean} True if can reset
   */
  static canResetStock(stock, waste) {
    return stock.isEmpty() && !waste.isEmpty();
  }

  /**
   * Checks if a card in a tableau pile can be picked up
   * @param {Tableau} tableau - Tableau pile
   * @param {number} cardIndex - Index of card to pick up
   * @returns {boolean} True if card can be picked up
   */
  static canPickUpFromTableau(tableau, cardIndex) {
    return tableau.canMoveFrom(cardIndex);
  }

  /**
   * Checks if game is winnable (auto-complete possible)
   * @param {GameState} gameState - Current game state
   * @returns {boolean} True if all remaining cards can go to foundations
   */
  static isAutoCompleteAvailable(gameState) {
    // All tableau cards should be face-up for auto-complete
    for (const tableau of gameState.tableaus) {
      const faceDownCount = tableau.getCards().filter(c => !c.faceUp).length;
      if (faceDownCount > 0) {
        return false;
      }
    }

    return true;
  }
}
