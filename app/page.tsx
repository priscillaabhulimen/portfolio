'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import SocialLinks from '@/components/SocialLinks';
import SectionHeader from '@/components/SectionHeader';
import FilterTabs from '@/components/FilterTabs';
import ProjectCard from '@/components/ProjectCard';
import CompanyShowcase from '@/components/CompanyShowcase';
import ScrollProgressNav from '@/components/ScrollProgressNav';

const TerminalModal = dynamic(() => import('@/components/TerminalModal'), {
  ssr: false,
});

export default function Home() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Web');

  const projects = [
    {
      id: 1,
      title: 'PayMeBlue (Blue) Business',
      description: 'A payment solutions built with the needs of the local consumer demographic and economic climate in mind',
      tags: ['Mobile', 'Flutter'],
      categories: ['Mobile'],
      features: [
        'Push notifications',
        'Deep linking',
        'Webview app with custom event triggers',
        'Live chat with Firebase',
        'QR and Barcode generation and encryption',
        'Feature-flaggin',
      ],
      demoUrl: 'https://paymeblue.com',
      logo: 'B',
      accentColor: '#4F46E5',
    },
    {
      id: 2,
      title: 'Goalspaces',
      description: 'A community-based, peer accountability social app that intends to encourage goal setting and goal achievement through bite-sized tasks',
      tags: ['Mobile', 'Flutter'],
      categories: ['Mobile'],
      features: [
        'Social goal sharing',
        'Peer accountability system',
        'Task breakdown tools',
        'Progress tracking',
        'Community engagement',
        'Achievement milestones',
      ],
      demoUrl: 'https://goalspaces.com',
      logo: '🎯',
      accentColor: '#8B5CF6',
    },
    {
      id: 3,
      title: 'LinkedIn - Redesign',
      description: 'A redesign of the LinkedIn web app home screen for better organisation and less information overload',
      tags: ['Design', 'Figma', 'Redesign'],
      categories: ['Design'],
      features: [
        'Simplified navigation',
        'Reduced visual clutter',
        'Improved content hierarchy',
        'Better mobile responsiveness',
        'Enhanced readability',
        'Modern design language',
      ],
      demoUrl: 'https://figma.com/...',
      logo: 'in',
      accentColor: '#0A66C2',
    },
    {
      id: 4,
      title: 'Battleship - Revised',
      description: 'A pure ESM javascript app to study JS functions, local and 3rd party modules, code structure and logical reasoning to create a game very much like and inspired by the popular game, "Battleship".',
      tags: ['NodeJS', 'Mini Games'],
      categories: ['Web'],
      features: [
        'Terminal-based gameplay with authentic CLI experience',
        'Multiple difficulty levels with random map generation',
        'Armored targets requiring strategic multi-hit tactics',
        'Real-time game statistics and scoring system',
        'Replay functionality with new mission generation',
        'Color-coded feedback for hits, misses, and armored targets',
      ],
      githubUrl: 'https://github.com/yourusername/battleship',
      demoUrl: '#battleship',
      logo: '⚓',
      accentColor: '#00ff00',
    },
    {
      id: 5,
      title: 'Three-In-A-Row',
      description: 'A mini game used to study DOM, BOM and CSSOM manipulation, as well as API calls using fetch in vanilla javascript. The use of frameworks was intentionally avoided in order to strengthen knowledge in the cpre episodes of web development.',
      tags: ['Web', 'HTML5', 'CSS3', 'Mini Games'],
      categories: ['Web', 'Backend'],
      features: [
        'Pure vanilla JavaScript implementation',
        'DOM manipulation mastery',
        'Real-time game state management',
        'Responsive grid layout',
        'Win detection algorithm',
        'Score tracking system',
      ],
      githubUrl: 'https://github.com/yourusername/three-in-a-row',
      demoUrl: 'https://three-in-a-row-demo.com',
      logo: '🎮',
      accentColor: '#F59E0B',
    },
    {
      id: 6,
      title: 'Poker Draw',
      description: 'A mini game that explores logical reasoning and constraint-based app development to deliver an app that allows you to draw cards and then determines your best hand from that draw.',
      tags: ['Web', 'VueJS', 'SCSS', 'TailwindCSS', 'Mini Games'],
      categories: ['Web'],
      features: [
        'Card drawing mechanics',
        'Hand evaluation algorithm',
        'Poker hand ranking system',
        'Visual card animations',
        'Score calculation',
        'Multiple game modes',
      ],
      githubUrl: 'https://github.com/yourusername/poker-draw',
      demoUrl: 'https://vue-poker-app.netlify.app/basic',
      logo: '🃏',
      accentColor: '#EC4899',
    },
  ];

  const companies = [
    { name: 'Central Bank of Nigeria', logo: '🏦', url: 'https://cbn.gov.ng' },
    { name: 'Africhange', logo: '💱', url: 'https://africhange.com' },
    { name: 'Goalspaces LLC', logo: '🎯', url: 'https://goalspaces.com' },
    { name: 'iRecharge Tech Innovations', logo: '⚡', url: 'https://irecharge.com' },
  ];

  const socialLinks = [
    { name: 'Resume', url: '/priscilla_a_resume.docx', icon: 'resume' as const },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/priscilla-abhulimen-052689165/', icon: 'linkedin' as const },
    { name: 'GitHub', url: 'https://github.com/priscillaabhulimen', icon: 'github' as const },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com/users/11046382/priscilla-abhulimen', icon: 'stackoverflow' as const },
  ];

  const filterTabs = ['Web', 'Mobile', 'Backend', 'Design', 'HTML5', 'CSS3', 'Flutter', 'VueJS', 'Figma', 'NodeJS', 'NextJS', 'MongoDB', 'ReactJS', 'TypeScript', 'Mini Games', 'Redesign', 'TailwindCSS', 'SCSS'];

  const filteredProjects = activeFilter === 'See more'
    ? projects
    : projects.filter((project) => project.categories.includes(activeFilter));

  const handleDemoClick = (demoUrl: string) => {
    if (demoUrl === '#battleship') {
      setIsTerminalOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-28">
      <ScrollProgressNav />

      {/* Hero Section */}
      <div className="pt-20" id="me">
        <HeroSection
          name="Priscilla Abhulimen"
          title="I design your products and build them too"
          description="I focus on ensuring scalability, and stability, as well as the best flow and user experience for different user types."
          avatarUrl="/avatar.svg"
          contactUrl={`mailto:priscillaabhulimen@gmail.com?subject=${'Hello Priscilla!'}&body=${'I came across your portfolio and would like to get in touch with you regarding potential opportunities. Please let me know the best way to reach you. Looking forward to connecting!'}`}
        />
      </div>
      

      {/* Projects Section */}
      <section id="work" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="My Work"
            subtitle="A curated selection of personal and commercial projects."
          />

          <FilterTabs
            tabs={filterTabs}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              const link = target.closest('a');
              if (link && link.getAttribute('href')?.includes('#battleship')) {
                e.preventDefault();
                handleDemoClick('#battleship');
              }
            }}
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                tags={project.tags}
                features={project.features}
                githubUrl={project.githubUrl}
                demoUrl={project.demoUrl}
                logo={project.logo}
                accentColor={project.accentColor}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <CompanyShowcase companies={companies} />

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 py-3 px-4 mx-4 lg:mx-12 mb-4 rounded-md border border-gray-500/20 bg-gradient-to-br from-gray-700/40 to-gray-900/40 backdrop-blur-xl">
        <SocialLinks links={socialLinks} />
      </footer>

      <div className="h-24" />

      {/* Terminal Modal */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </main>
  );
}
