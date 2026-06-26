// Card constants for Klondike Solitaire

export const SUITS = {
  HEARTS: '♥',
  DIAMONDS: '♦',
  CLUBS: '♣',
  SPADES: '♠'
};

export const RANKS = {
  ACE: 'A',
  TWO: '2',
  THREE: '3',
  FOUR: '4',
  FIVE: '5',
  SIX: '6',
  SEVEN: '7',
  EIGHT: '8',
  NINE: '9',
  TEN: '10',
  JACK: 'J',
  QUEEN: 'Q',
  KING: 'K'
};

export const RANK_VALUES = {
  'A': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 11,
  'Q': 12,
  'K': 13
};

export const COLORS = {
  RED: 'red',
  BLACK: 'black'
};

export const SUIT_COLORS = {
  [SUITS.HEARTS]: COLORS.RED,
  [SUITS.DIAMONDS]: COLORS.RED,
  [SUITS.CLUBS]: COLORS.BLACK,
  [SUITS.SPADES]: COLORS.BLACK
};

export const ALL_SUITS = Object.values(SUITS);
export const ALL_RANKS = Object.values(RANKS);

export const DRAW_COUNT = 3; // Draw 3 cards from stock
