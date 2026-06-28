# 🎮 Free Online Games Collection

A collection of classic games built with vanilla HTML/CSS/JavaScript. No frameworks, no build tools, just pure web technologies optimized for both desktop and mobile play.

**Play now:** [Visit the game collection](#running-locally)

## 🎯 Available Games

### 1. Klondike Solitaire ♠️
Classic card game with modern features.

**Features:**
- Draw-1 or Draw-3 modes (selectable)
- Drag-and-drop interface (desktop)
- Tap-to-select interface (mobile)
- Undo/Redo moves
- Auto-complete when winnable
- Timer & move counter
- Smooth animations

**How to Play:**
- Move all 52 cards to four foundation piles (Ace to King by suit)
- Build tableaus down in alternating colors
- Click stock to draw cards
- Double-tap cards to auto-move to foundations

---

### 2. Connect 4 🔴
Drop discs and connect four in a row to win!

**Features:**
- 2-player local gameplay (Red vs Yellow)
- Click-to-drop interface
- Animated disc drops with bounce effect
- Win detection (horizontal, vertical, diagonal)
- Draw detection
- Undo moves
- Winning discs highlighted

**How to Play:**
- Players take turns dropping colored discs
- Click a column to drop your disc
- Connect four discs in a row (any direction) to win
- First to connect four wins!

---

### 3. Dots and Boxes ⬛
Strategic two-player game of connecting dots.

**Features:**
- 2-player local gameplay (Red vs Blue)
- 3 grid sizes: 5×5, 6×6, 7×7
- Click lines to connect dots
- Animated box completions
- Score tracking
- Extra turn when completing a box
- Undo moves
- Touch-optimized for mobile

**How to Play:**
- Players take turns drawing lines between dots
- Complete all 4 sides of a box to claim it (score +1 point)
- Completing a box earns you another turn
- Player with most boxes wins!

**Grid Sizes:**
- 5×5: Quick games (~16 boxes)
- 6×6: Medium games (~25 boxes)
- 7×7: Long games (~36 boxes)

---

## 🚀 Running Locally

### Option 1: Python HTTP Server (Recommended)
```bash
python3 -m http.server 8000
```
Then visit: **http://localhost:8000**

### Option 2: Node.js HTTP Server
```bash
npx http-server -p 8000
```
Then visit: **http://localhost:8000**

### Option 3: PHP Server
```bash
php -S localhost:8000
```
Then visit: **http://localhost:8000**

## 📱 Mobile Optimized

All games are fully optimized for mobile play:
- **Touch-friendly controls** - Tap instead of drag on mobile devices
- **Responsive layouts** - Adapts to screen size
- **Large touch targets** - Easy to tap accurately
- **Works on iPhone/Android** - Tested on mobile browsers

The site automatically detects touch devices and switches to tap controls for the best experience.

## 🌐 Deployment

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

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Styling**: Modern CSS with gradients, shadows, and animations
- **No frameworks or build tools** - runs directly in the browser
- **Mobile-first responsive design**
- **Touch device detection** - Automatic UI adaptation

## ✅ Browser Compatibility

- Chrome/Edge (Chromium) ✅
- Firefox ✅
- Safari (desktop & iOS) ✅
- Chrome Android ✅

Requires ES6 module support (all modern browsers).

## 📁 File Structure

```
/
├── index.html                      # Game selection homepage
├── solitaire.html                  # Klondike Solitaire game
├── connect4.html                   # Connect 4 game
├── dotsboxes.html                  # Dots and Boxes game
├── render.yaml                     # Render.com configuration
├── styles/
│   ├── main.css                   # Global styles and layout
│   ├── home.css                   # Homepage styles
│   ├── cards.css                  # Solitaire card styling
│   ├── game-board.css             # Solitaire board layout
│   ├── connect4.css               # Connect 4 styling
│   └── dotsboxes.css              # Dots and Boxes styling
├── js/
│   ├── main.js                    # Solitaire initialization
│   ├── utils/                     # Solitaire utilities
│   ├── game/                      # Solitaire game logic
│   ├── ui/                        # Solitaire UI components
│   ├── history/                   # Solitaire history system
│   ├── connect4/
│   │   ├── game/                  # Connect 4 game logic
│   │   ├── ui/                    # Connect 4 UI components
│   │   └── main.js                # Connect 4 initialization
│   └── dotsboxes/
│       ├── game/                  # Dots and Boxes game logic
│       ├── ui/                    # Dots and Boxes UI components
│       └── main.js                # Dots and Boxes initialization
```

## 🎨 Design Features

- **Purple gradient background** - Consistent visual theme
- **Card-based game selection** - Easy navigation
- **Smooth animations** - CSS-powered transitions
- **Responsive grid layouts** - Works on all screen sizes
- **Touch-friendly buttons** - 44px minimum touch targets (iOS standard)
- **Color-coded players** - Red/Blue/Yellow for easy identification

## 🧩 Adding New Games

The codebase is structured to easily add new games:

1. Create game HTML file (e.g., `chess.html`)
2. Create game JavaScript modules in `js/chess/`
3. Create game CSS in `styles/chess.css`
4. Add game card to `index.html`

Each game is completely self-contained with its own:
- Game logic (models, state management)
- UI rendering and controls
- Styling and animations

## 📝 License

MIT License - Feel free to use this code for any purpose.

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs or issues
- Suggest new games to add
- Submit pull requests with improvements
- Share feedback on gameplay

## 🎯 Roadmap

Future games to add:
- Chess
- Checkers
- Tic-Tac-Toe
- Minesweeper
- Sudoku
- And more!

---

**Enjoy the games!** 🎮
