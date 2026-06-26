// Move representation for history tracking

export class Move {
  /**
   * Creates a new Move record
   * @param {string} type - Move type (card, draw, reset)
   * @param {object} data - Move-specific data
   */
  constructor(type, data) {
    this.type = type;
    this.data = data;
    this.timestamp = Date.now();
  }

  /**
   * Creates a card move
   * @param {Pile} sourcePile - Source pile
   * @param {Pile} targetPile - Target pile
   * @param {number} cardCount - Number of cards moved
   * @param {boolean} flippedCard - Whether a card was flipped in source
   * @returns {Move} New move record
   */
  static cardMove(sourcePile, targetPile, cardCount, flippedCard = false) {
    return new Move('card', {
      sourceType: sourcePile.type,
      sourceIndex: sourcePile.index || 0,
      targetType: targetPile.type,
      targetIndex: targetPile.index || 0,
      cardCount,
      flippedCard
    });
  }

  /**
   * Creates a stock draw move
   * @param {number} cardsDrawn - Number of cards drawn
   * @returns {Move} New move record
   */
  static drawMove(cardsDrawn) {
    return new Move('draw', {
      cardsDrawn
    });
  }

  /**
   * Creates a stock reset move
   * @param {number} cardsReset - Number of cards reset
   * @returns {Move} New move record
   */
  static resetMove(cardsReset) {
    return new Move('reset', {
      cardsReset
    });
  }
}
