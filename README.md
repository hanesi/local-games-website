# Klondike Solitaire

A modern, fully-featured Klondike Solitaire web game built with vanilla HTML/CSS/JavaScript.

## Features

- **Classic Klondike Solitaire** (draw-3 variant)
- **Drag-and-drop interface** for intuitive gameplay
- **Undo/Redo moves** with full history tracking
- **Timer & Move counter** to track your performance
- **Auto-complete** when game is winnable
- **Double-click** to automatically move cards to foundations
- **Mobile-responsive design** for play on any device
- **Modern visual design** with smooth animations

## How to Play

### Objective
Move all 52 cards to the four foundation piles, building each suit from Ace to King.

### Rules
- **Tableaus**: Build down in alternating colors (e.g., red 7 on black 8)
- **Foundations**: Build up by suit starting with Ace (A → 2 → 3 ... → K)
- **Stock**: Draw 3 cards at a time; click empty stock to reset from waste
- **Empty tableau columns**: Only Kings can be placed on empty columns

### Controls
- **Drag cards** to move them between piles
- **Double-click** a card to auto-move it to the appropriate foundation
- **Click stock** to draw 3 cards
- **New Game**: Start a fresh game
- **Undo/Redo**: Navigate through move history
- **Auto-Complete**: Automatically finish the game when possible

## Running Locally

### Option 1: Python HTTP Server
```bash
python3 -m http.server 8000
```
Then visit: http://localhost:8000

### Option 2: Node.js HTTP Server
```bash
npx http-server -p 8000
```
Then visit: http://localhost:8000

### Option 3: PHP Server
```bash
php -S localhost:8000
```
Then visit: http://localhost:8000

## Deployment

### Render.com (Static Site)
1. Push this repository to GitHub
2. Connect your repository in the Render dashboard
3. Select "Static Site" as the service type
4. Deploy automatically using the included `render.yaml`

### Netlify
1. Drag and drop the project folder to Netlify
2. Or connect your GitHub repository for automatic deployments

### Vercel
1. Run `vercel` in the project directory
2. Or connect your GitHub repository

### GitHub Pages
1. Push to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Select the main branch as source

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Styling**: Modern CSS with gradients, shadows, and animations
- **No frameworks or build tools** - runs directly in the browser
- **Mobile-first responsive design**

## Browser Compatibility

- Chrome/Edge (Chromium) ✅
- Firefox ✅
- Safari (desktop & iOS) ✅
- Chrome Android ✅

Requires ES6 module support (all modern browsers).

## File Structure

```
/
├── index.html                      # Main entry point
├── render.yaml                     # Render.com configuration
├── styles/
│   ├── main.css                   # Global styles and layout
│   ├── cards.css                  # Card styling and animations
│   └── game-board.css             # Game board layout
├── js/
│   ├── main.js                    # App initialization
│   ├── utils/
│   │   ├── constants.js           # Suits, ranks, colors
│   │   └── helpers.js             # Utilities
│   ├── game/
│   │   ├── Card.js                # Card model
│   │   ├── Pile.js                # Base pile class
│   │   ├── Stock.js               # Draw pile
│   │   ├── Waste.js               # Discard pile
│   │   ├── Foundation.js          # Foundation piles
│   │   ├── Tableau.js             # Tableau columns
│   │   ├── MoveValidator.js       # Move validation
│   │   └── GameState.js           # Game state manager
│   ├── ui/
│   │   ├── Renderer.js            # DOM manipulation
│   │   ├── DragDropHandler.js     # Drag-and-drop logic
│   │   ├── AnimationManager.js    # Animations
│   │   └── UIController.js        # Controls and stats
│   └── history/
│       ├── Move.js                # Move representation
│       └── HistoryManager.js      # Undo/redo system
```

## License

MIT License - Feel free to use this code for any purpose.

## Contributing

Contributions welcome! Feel free to open issues or submit pull requests.
