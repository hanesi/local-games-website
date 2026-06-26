// DOM manipulation and rendering

export class Renderer {
  constructor(gameState) {
    this.gameState = gameState;
    this.elements = {
      stock: document.getElementById('stock'),
      waste: document.getElementById('waste'),
      foundations: Array.from({ length: 4 }, (_, i) =>
        document.getElementById(`foundation-${i}`)
      ),
      tableaus: Array.from({ length: 7 }, (_, i) =>
        document.getElementById(`tableau-${i}`)
      )
    };
  }

  /**
   * Renders the entire game state
   */
  renderAll() {
    this.renderStock();
    this.renderWaste();
    this.renderFoundations();
    this.renderTableaus();
  }

  /**
   * Renders the stock pile
   */
  renderStock() {
    const stockEl = this.elements.stock;
    stockEl.innerHTML = '';

    if (!this.gameState.stock.isEmpty()) {
      const cardEl = this.createCardElement(null, true);
      cardEl.classList.add('stock-card');
      stockEl.appendChild(cardEl);
    } else {
      // Show empty stock placeholder
      const emptyEl = document.createElement('div');
      emptyEl.className = 'card-empty';
      emptyEl.textContent = '↻';
      stockEl.appendChild(emptyEl);
    }
  }

  /**
   * Renders the waste pile
   */
  renderWaste() {
    const wasteEl = this.elements.waste;
    wasteEl.innerHTML = '';

    const visibleCards = this.gameState.waste.getVisibleCards(this.gameState.drawCount);

    if (visibleCards.length === 0) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'card-empty';
      wasteEl.appendChild(emptyEl);
    } else {
      visibleCards.forEach((card, index) => {
        const cardEl = this.createCardElement(card);
        cardEl.style.left = `${index * 20}px`;
        cardEl.dataset.pileType = 'waste';
        cardEl.dataset.cardIndex = this.gameState.waste.size() - visibleCards.length + index;

        // Only top card is draggable
        if (index === visibleCards.length - 1) {
          cardEl.draggable = true;
        }

        wasteEl.appendChild(cardEl);
      });
    }
  }

  /**
   * Renders all foundation piles
   */
  renderFoundations() {
    this.gameState.foundations.forEach((foundation, index) => {
      this.renderFoundation(index);
    });
  }

  /**
   * Renders a single foundation pile
   * @param {number} index - Foundation index
   */
  renderFoundation(index) {
    const foundationEl = this.elements.foundations[index];
    foundationEl.innerHTML = '';

    const topCard = this.gameState.foundations[index].topCard();

    if (topCard) {
      const cardEl = this.createCardElement(topCard);
      cardEl.dataset.pileType = 'foundation';
      cardEl.dataset.pileIndex = index;
      cardEl.draggable = true;
      foundationEl.appendChild(cardEl);
    } else {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'card-empty';
      emptyEl.textContent = this.gameState.foundations[index].suit;
      emptyEl.dataset.pileType = 'foundation';
      emptyEl.dataset.pileIndex = index;
      foundationEl.appendChild(emptyEl);
    }
  }

  /**
   * Renders all tableau piles
   */
  renderTableaus() {
    this.gameState.tableaus.forEach((tableau, index) => {
      this.renderTableau(index);
    });
  }

  /**
   * Renders a single tableau pile
   * @param {number} index - Tableau index
   */
  renderTableau(index) {
    const tableauEl = this.elements.tableaus[index];
    tableauEl.innerHTML = '';

    const cards = this.gameState.tableaus[index].getCards();

    if (cards.length === 0) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'card-empty';
      emptyEl.dataset.pileType = 'tableau';
      emptyEl.dataset.pileIndex = index;
      tableauEl.appendChild(emptyEl);
    } else {
      cards.forEach((card, cardIndex) => {
        const cardEl = this.createCardElement(card, !card.faceUp);
        cardEl.style.top = `${cardIndex * 25}px`;
        cardEl.dataset.pileType = 'tableau';
        cardEl.dataset.pileIndex = index;
        cardEl.dataset.cardIndex = cardIndex;

        // Face-up cards are draggable
        if (card.faceUp) {
          cardEl.draggable = true;
        }

        tableauEl.appendChild(cardEl);
      });
    }
  }

  /**
   * Creates a card DOM element
   * @param {Card} card - Card to render (null for face-down stock)
   * @param {boolean} faceDown - Whether to render face-down
   * @returns {HTMLElement} Card element
   */
  createCardElement(card, faceDown = false) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';

    if (faceDown || !card) {
      cardEl.classList.add('face-down');
      cardEl.innerHTML = '<div class="card-back"></div>';
    } else {
      cardEl.classList.add('face-up');
      cardEl.classList.add(card.color);
      cardEl.dataset.cardId = card.id;

      const rankEl = document.createElement('div');
      rankEl.className = 'card-rank';
      rankEl.textContent = card.rank;

      const suitEl = document.createElement('div');
      suitEl.className = 'card-suit';
      suitEl.textContent = card.suit;

      cardEl.appendChild(rankEl);
      cardEl.appendChild(suitEl);
    }

    return cardEl;
  }

  /**
   * Highlights valid drop targets for a card
   * @param {Card} card - Card being dragged
   * @param {number} cardCount - Number of cards being dragged
   */
  highlightValidTargets(card, cardCount) {
    // Check foundations (only for single cards)
    if (cardCount === 1) {
      this.gameState.foundations.forEach((foundation, index) => {
        if (foundation.canAccept(card)) {
          this.elements.foundations[index].classList.add('valid-target');
        }
      });
    }

    // Check tableaus
    this.gameState.tableaus.forEach((tableau, index) => {
      if (tableau.canAccept(card)) {
        this.elements.tableaus[index].classList.add('valid-target');
      }
    });
  }

  /**
   * Removes all drop target highlights
   */
  clearValidTargets() {
    this.elements.foundations.forEach(el => el.classList.remove('valid-target'));
    this.elements.tableaus.forEach(el => el.classList.remove('valid-target'));
  }
}
