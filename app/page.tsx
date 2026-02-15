'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import SocialLinks from '@/components/SocialLinks';
import SectionHeader from '@/components/SectionHeader';
import FilterTabs from '@/components/FilterTabs';
import ProjectCard from '@/components/ProjectCard';
import CompanyShowcase from '@/components/CompanyShowcase';
import ScrollProgressNav from '@/components/ScrollProgressNav';
import projects from '../lib/project';
const ThreeInARowModal = dynamic(() => import('@/components/ThreeInARowModal'), {
  ssr: false,
});

const TerminalModal = dynamic(() => import('@/components/TerminalModal'), {
  ssr: false,
});

export default function Home() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isThreeInARowOpen, setIsThreeInARowOpen] = useState(false);

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

  const filteredProjects = activeFilter === null
    ? projects
    : projects.filter((project) => project.tags.includes(activeFilter));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      const href = link?.getAttribute('href');
      
      if (href === '#battleship') {
        e.preventDefault();        // Stop navigation
        e.stopPropagation();       // Stop event bubbling
        setIsTerminalOpen(true);   // Open modal
      } else if (href === '#three-in-a-row') {
        e.preventDefault();
        e.stopPropagation();
        setIsThreeInARowOpen(true);
      }
    };

    // The 'true' parameter makes this a CAPTURING listener
    // It fires BEFORE the default link behavior
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  

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
            onTabChange={(t: string | null) => setActiveFilter(t)}
          />

          <div className="flex flex-wrap gap-8 w-full">
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
                liveUrl={project.liveUrl}
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

      <ThreeInARowModal
        isOpen={isThreeInARowOpen}
        onClose={() => setIsThreeInARowOpen(false)}
      />
    </main>
  );
}
