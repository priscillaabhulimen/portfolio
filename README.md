# Battleship Terminal Game

A web-based battleship game with an authentic terminal interface experience and beautiful glassmorphism UI. Built with Next.js, TypeScript, and xterm.js.

## Features

- 🎯 **Strategic Gameplay**: Plan your attacks carefully with limited missiles
- 💻 **Terminal Interface**: Authentic command-line experience in your browser
- 🛡️ **Armored Targets**: Some targets require multiple hits
- 🎮 **Multiple Maps**: Random map selection for replayability
- 🌐 **Web-Based**: Play directly in your browser, no installation needed
- ✨ **Glassmorphism UI**: Beautiful card design with flip animations

## New: Glassmorphism Project Cards

The project now features a stunning glassmorphism card component that showcases your projects with style:

### Features of the Project Card:
- **Flip Animation**: Click to flip between front (description) and back (features)
- **Glassmorphism Design**: Frosted glass effect with backdrop blur
- **Hover Effects**: Smooth transitions and shine effects
- **Customizable**: Logo, accent color, tags, and features
- **Responsive Buttons**: GitHub link and demo/play button
- **Smooth Animations**: 3D flip effect with CSS transforms

### Using the ProjectCard Component

```tsx
import ProjectCard from '@/components/ProjectCard';

<ProjectCard
  title="Your Project Name"
  description="Brief description of your project"
  tags={['React', 'TypeScript', 'Next.js']}
  features={[
    'Feature one',
    'Feature two',
    'Feature three',
  ]}
  githubUrl="https://github.com/username/repo"
  demoUrl="https://demo-url.com"
  logo="🎯" // or "B" for text logo
  accentColor="#00ff00" // Hex color for accents
/>
```

### Card Customization Options

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Project title (required) |
| `description` | string | Brief project description (required) |
| `tags` | string[] | Technology/category tags (required) |
| `features` | string[] | List of key features (required) |
| `githubUrl` | string | GitHub repository URL (optional) |
| `demoUrl` | string | Live demo URL (optional) |
| `logo` | string | Emoji or single character logo (optional) |
| `accentColor` | string | Hex color code for buttons/accents (default: '#00ff00') |

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### View the Showcase

Visit [http://localhost:3000/showcase](http://localhost:3000/showcase) to see multiple project cards with different styles and configurations.

## How to Play

1. Click the glassmorphism card to flip and reveal features
2. Click the "Play" button to launch the terminal
3. Accept the mission by typing "yes" or "y"
4. Enter coordinates to fire missiles (e.g., "A4", "B7")
5. Try to hit all enemy targets before running out of missiles!

### Game Symbols

- **X** (Red): Missed shot
- **O** (Green): Target hit and destroyed
- **-** (Yellow): Armored target hit (requires more shots)
- **-** (Blue): Unrevealed target positions (shown at game end)

### Tips

- Armored targets (shown with **-**) require multiple hits to destroy
- You have a limited number of missiles per game
- Plan your shots strategically to maximize your chances of winning
- Each map is randomly selected, so every game is different!

## Building for Production

To create a production build:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **xterm.js** - Terminal emulation
- **React 19** - UI library

## Project Structure

```
battleship-terminal-app/
├── app/
│   ├── page.tsx           # Main landing page with project card
│   ├── showcase/
│   │   └── page.tsx       # Showcase of multiple cards
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ProjectCard.tsx    # Glassmorphism card component
│   └── TerminalModal.tsx  # Terminal game interface
├── lib/
│   ├── battleshipEngine.ts # Game logic
│   ├── mapData.ts         # Type definitions for maps
│   └── map.json           # Game map data
└── public/                # Static assets
```

## Credits

Original game by **Priscilla Abhulimen**  
Web terminal adaptation with enhanced UI/UX and glassmorphism design

## License

ISC
