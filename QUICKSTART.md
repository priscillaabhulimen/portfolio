# Quick Start Guide - Battleship Terminal Game

## 🚀 Getting Started

### Step 1: Install Dependencies
Navigate to the project folder and run:
```bash
cd battleship-terminal-app
npm install
```

### Step 2: Run the Development Server
```bash
npm run dev
```

### Step 3: Open Your Browser
Visit: http://localhost:3000

### Step 4: Play the Game!
1. Click "LAUNCH TERMINAL" button
2. Type "yes" to accept the mission
3. Enter coordinates like "A4" or "B7" to fire missiles
4. Hit all targets before running out of missiles!

## 🎮 Game Controls

- Type coordinates (e.g., "A4", "B7") and press Enter to fire
- Answer "yes" or "no" to prompts
- Use Backspace to correct typos

## 📊 Understanding the Board

```
   A  B  C  D  E  F  G  H
1
2     X     O
3        -
4  X
```

- **Empty space** = Not fired yet
- **X (Red)** = Missed shot
- **O (Green)** = Target destroyed
- **- (Yellow)** = Armored target hit (needs more shots)
- **- (Blue)** = Unrevealed target (game end)

## 🎯 Tips for Success

1. **Plan Your Shots**: You have limited missiles!
2. **Track Patterns**: Ships are placed in patterns
3. **Focus on Armored Targets**: They require multiple hits
4. **Don't Waste Missiles**: Avoid shooting the same spot twice

## 🛠️ Troubleshooting

### Port Already in Use?
```bash
npm run dev -- -p 3001
```

### Terminal Not Showing?
- Make sure JavaScript is enabled in your browser
- Try refreshing the page
- Check browser console for errors

## 📦 Building for Production

```bash
npm run build
npm start
```

Your game will be ready to deploy!

## 🌐 Deployment Options

- **Vercel**: `vercel deploy`
- **Netlify**: Connect your git repository
- **Docker**: Create a Dockerfile for containerization

## 💡 Features

✅ Authentic terminal interface  
✅ Multiple difficulty levels (random maps)  
✅ Armored targets for added challenge  
✅ Responsive design  
✅ Keyboard-friendly controls  
✅ Game state persistence  

Enjoy the game! 🎉
