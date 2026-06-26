// Animation manager for smooth card movements

export class AnimationManager {
  constructor() {
    this.animationDuration = 200;
  }

  /**
   * Animates card movement from source to target
   * @param {HTMLElement} cardEl - Card element
   * @param {HTMLElement} targetEl - Target pile element
   * @param {Function} callback - Callback after animation
   */
  animateMove(cardEl, targetEl, callback) {
    const startRect = cardEl.getBoundingClientRect();
    const endRect = targetEl.getBoundingClientRect();

    const deltaX = endRect.left - startRect.left;
    const deltaY = endRect.top - startRect.top;

    // Create animation
    cardEl.style.transition = `transform ${this.animationDuration}ms ease-out`;
    cardEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    setTimeout(() => {
      cardEl.style.transition = '';
      cardEl.style.transform = '';
      if (callback) callback();
    }, this.animationDuration);
  }

  /**
   * Animates card flip
   * @param {HTMLElement} cardEl - Card element
   * @param {Function} callback - Callback after animation
   */
  animateFlip(cardEl, callback) {
    cardEl.style.transition = `transform 300ms ease-in-out`;
    cardEl.style.transform = 'rotateY(180deg)';

    setTimeout(() => {
      cardEl.style.transition = '';
      cardEl.style.transform = '';
      if (callback) callback();
    }, 300);
  }

  /**
   * Animates win celebration
   * @param {HTMLElement} gameBoard - Game board element
   */
  animateWin(gameBoard) {
    // Add celebration class
    gameBoard.classList.add('win-celebration');

    setTimeout(() => {
      gameBoard.classList.remove('win-celebration');
    }, 2000);
  }
}
