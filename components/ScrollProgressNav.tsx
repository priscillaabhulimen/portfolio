'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgressNav() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('me');
  const [checkpointPositions, setCheckpointPositions] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const calculateCheckpointPositions = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      
      const positions: { [key: string]: number } = {};
      const sections = ['me', 'work'];
      
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const percentage = (offsetTop / documentHeight) * 100;
          positions[sectionId] = Math.min(100, Math.max(0, percentage));
        }
      });
      
      setCheckpointPositions(positions);
    };

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(progress);

      const sections = ['me', 'work'];
      let current = 'me';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    calculateCheckpointPositions();
    window.addEventListener('resize', calculateCheckpointPositions);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateCheckpointPositions);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const checkpoints = [
    { id: 'me', label: 'Me' },
    { id: 'work', label: 'Work' },
  ];

  const isCheckpointPassed = (checkpointId: string) => {
    const sections = ['me', 'work'];
    const currentIndex = sections.indexOf(activeSection);
    const checkpointIndex = sections.indexOf(checkpointId);
    return checkpointIndex <= currentIndex;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-3">
        
        <div className="relative h-2.5 mt-8 mb-6 bg-white/10 rounded-full overflow-visible">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />

          {checkpoints.map((checkpoint) => (
            <button
              key={checkpoint.id}
              onClick={() => scrollToSection(checkpoint.id)}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
              style={{ left: `${checkpointPositions[checkpoint.id] || 0}%` }}
            >
              <div
                className={`w-4 h-4 rounded-full border border-gray-600/25 transition-all duration-300 ${
                  isCheckpointPassed(checkpoint.id)
                    ? 'bg-pink-300 border-white scale-125 shadow-lg shadow-white/50'
                    : 'bg-gray-800 border-white/40 hover:bg-white/50 hover:scale-110'
                }`}
              />
              
              <span className={`absolute top-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                isCheckpointPassed(checkpoint.id)
                  ? 'text-white scale-105'
                  : 'text-gray-400 group-hover:text-white'
              }`}>
                {checkpoint.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}