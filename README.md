# Priscilla Abhulimen - Portfolio Website

A modern, dark-themed portfolio website featuring glassmorphism design, scroll-based navigation, and an integrated terminal game. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- 🎨 **Glassmorphism Design**: Frosted glass effects with backdrop blur throughout
- 📊 **Scroll Progress Navigation**: Interactive progress bar with section checkpoints
- 💳 **Flip Card Projects**: 3D animated project cards showing details and features
- 🎮 **Integrated Terminal Game**: Playable Battleship game in a web terminal
- 📱 **Fully Responsive**: Beautiful on all devices
- 🔗 **Social Integration**: Quick links to resume, GitHub, LinkedIn, and Stack Overflow

## 🎯 Key Components

### Scroll Progress Navigation
- Real-time scroll progress indicator
- Clickable checkpoints for each section
- Active section highlighting
- Smooth scroll navigation

### Glassmorphism Project Cards
- **Front**: Project title, description, logo, and technology tags
- **Back**: Feature list with GitHub and demo/play buttons
- **3D Flip Animation** on click
- **Hover Effects** with shine and scale animations
- **Customizable** accent colors per project

### Hero Section
- Professional introduction
- Avatar with glow effects
- Call-to-action button
- Responsive layout with text/image overlap

### Fixed Footer
- Social media links
- Resume download
- Glassmorphic styling
- Always accessible at bottom

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Clone or extract the project

2. Install dependencies:
```bash
npm install
```

3. Add your avatar image to `public/avatar.png` (or update the path)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Customization

### Update Your Information

Edit `app/page.tsx` to customize:

#### Personal Details
```tsx
<HeroSection
  name="Your Name"
  title="Your Title/Tagline"
  description="Your bio..."
  avatarUrl="/avatar.png"
/>
```

#### Projects
```tsx
const projects = [
  {
    id: 1,
    title: 'Project Name',
    description: 'Brief description...',
    tags: ['React', 'TypeScript'],
    categories: ['Web'], // Web, Mobile, Backend, Design
    features: ['Feature 1', 'Feature 2'],
    githubUrl: 'https://github.com/you/project',
    demoUrl: 'https://demo.com',
    logo: '🚀',
    accentColor: '#4F46E5',
  },
];
```

#### Social Links
```tsx
const socialLinks = [
  { name: 'Resume', url: '/your-resume.pdf', icon: 'resume' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/you', icon: 'linkedin' },
  { name: 'GitHub', url: 'https://github.com/you', icon: 'github' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com/users/you', icon: 'stackoverflow' },
];
```

#### Companies/Clients
```tsx
const companies = [
  { name: 'Company Name', logo: '🏢', url: 'https://company.com' },
];
```

### Add More Sections to Navigation

In `components/ScrollProgressNav.tsx`:

```tsx
const checkpoints = [
  { id: 'me', label: 'Me' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' }, // Add new sections
];
```

Then add the corresponding section with `id="contact"` in your page.

## 🎮 Special Features

### Battleship Terminal Game

The portfolio includes an interactive Battleship game accessible through the project cards:

1. Click any project card to flip and see features
2. Click "Play" on the Battleship project
3. Terminal modal opens with the game
4. Play directly in your browser!

### Project Filtering

Projects can be filtered by category:
- Web
- Mobile
- Backend
- Design
- See more (shows all)

## 📂 Project Structure

```
battleship-terminal-app/
├── app/
│   ├── page.tsx              # Main portfolio page
│   ├── portfolio/page.tsx    # Alternative portfolio route
│   ├── showcase/page.tsx     # Card showcase examples
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ProjectCard.tsx       # Glassmorphism flip card
│   ├── ScrollProgressNav.tsx # Scroll progress navbar
│   ├── HeroSection.tsx       # Hero with avatar
│   ├── SocialLinks.tsx       # Social media links
│   ├── SectionHeader.tsx     # Section titles
│   ├── FilterTabs.tsx        # Category filters
│   ├── CompanyShowcase.tsx   # Client logos
│   └── TerminalModal.tsx     # Battleship game terminal
├── lib/
│   ├── battleshipEngine.ts   # Game logic
│   ├── mapData.ts            # Type definitions
│   └── map.json              # Game maps
└── public/
    └── avatar.png            # Your profile picture
```

## 🎨 Color Palette

The portfolio uses a dark theme with accent colors:

- **Background**: `#0a0a0a` (near black)
- **Glass Effects**: `white/5` to `white/10` with backdrop blur
- **Accent Colors**: Purple (`#8B5CF6`), Pink (`#EC4899`), Blue (`#4F46E5`)
- **Project-Specific**: Customizable per project card

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Connect your Git repository
2. Build command: `npm run build`
3. Publish directory: `.next`

### Manual Build
```bash
npm run build
npm start
```

## 📚 Documentation

- **Quick Start**: QUICKSTART.md
- **Setup Guide**: PORTFOLIO_SETUP_GUIDE.md
- **Project Cards**: PROJECTCARD_GUIDE.md
- **Troubleshooting**: TROUBLESHOOTING.md

## 💻 Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **xterm.js** - Terminal emulation
- **React 19** - UI library

## 🎯 Design Philosophy

- **Dark & Modern**: Professional dark theme with subtle accents
- **Glassmorphism**: Frosted glass effects throughout
- **Smooth Animations**: Purposeful, not distracting
- **Content First**: Clear hierarchy and readability
- **Interactive**: Engaging scroll navigation and flip cards

## 📄 License

ISC

## 👤 Author

**Priscilla Abhulimen**

Portfolio website showcasing full-stack development, product design, and software engineering projects.

---

**Questions?** Check the guides in the project or open an issue!
