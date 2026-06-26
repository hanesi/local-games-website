// Base Pile class for all card piles

export class Pile {
  /**
   * Creates a new Pile
   * @param {string} type - Type of pile (stock, waste, foundation, tableau)
   */
  constructor(type) {
    this.type = type;
    this.cards = [];
  }

  /**
   * Adds a card to the pile
   * @param {Card} card - Card to add
   */
  addCard(card) {
    this.cards.push(card);
  }

  /**
   * Adds multiple cards to the pile
   * @param {Card[]} cards - Cards to add
   */
  addCards(cards) {
    this.cards.push(...cards);
  }

  /**
   * Removes and returns the top card
   * @returns {Card|null} Top card or null if empty
   */
  removeCard() {
    return this.cards.pop() || null;
  }

  /**
   * Removes multiple cards from the top
   * @param {number} count - Number of cards to remove
   * @returns {Card[]} Removed cards
   */
  removeCards(count) {
    return this.cards.splice(-count, count);
  }

  /**
   * Gets the top card without removing it
   * @returns {Card|null} Top card or null if empty
   */
  topCard() {
    return this.cards.length > 0 ? this.cards[this.cards.length - 1] : null;
  }

  /**
   * Gets the number of cards in the pile
   * @returns {number} Card count
   */
  size() {
    return this.cards.length;
  }

  /**
   * Checks if the pile is empty
   * @returns {boolean} True if empty
   */
  isEmpty() {
    return this.cards.length === 0;
  }

  /**
   * Clears all cards from the pile
   */
  clear() {
    this.cards = [];
  }

  /**
   * Gets all cards in the pile
   * @returns {Card[]} Array of cards
   */
  getCards() {
    return this.cards;
  }

  /**
   * Gets cards starting from a specific index
   * @param {number} index - Starting index
   * @returns {Card[]} Cards from index to end
   */
  getCardsFrom(index) {
    return this.cards.slice(index);
  }
}
