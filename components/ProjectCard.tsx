'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  features: string[];
  githubUrl?: string;
  demoUrl?: string;
  logo?: string;
  liveUrl?: string;
}

export default function ProjectCard({
  title,
  description,
  tags,
  features,
  githubUrl,
  demoUrl,
  logo,
  liveUrl,
}: ProjectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <div
      className={`group perspective-1000 min-h-80 cursor-pointer ${
        logo 
          ? 'w-full md:flex-[1_1_calc(50%-1rem)] md:max-w-[calc(50%-1rem)]' 
          : 'w-full md:flex-[0_1_400px] md:max-w-[400px]'
      }`}
      onClick={handleFlip}
      onKeyDown={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`${title} project card. ${isFlipped ? 'Showing features. Press Enter or Space to view description.' : 'Showing description. Press Enter or Space to view features.'}`}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
      >
        {/* Front of Card */}
        <div 
          className="absolute inset-0 backface-hidden" 
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            // Safari fix: force opacity to 0 the instant we cross 90°, don't wait for
            // backface-visibility to kick in (it's delayed in Safari's compositor).
            opacity: isFlipped ? 0 : 1,
            transition: 'opacity 0s 0.35s',
          }}
          aria-hidden={isFlipped}
        >
          <div className="relative w-full h-full rounded-md overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 focus-within:ring-offset-black">
            {/* Solid base layer for Safari — backdrop-blur alone renders as transparent in Safari 3D contexts */}
            <div className="absolute inset-0 bg-[#0a0a12]/80 rounded-md" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl" />
            
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 50% 50%, transparent 70%)`,
              }}
            />
            
            <div className="relative h-full flex flex-col justify-between p-6">
              <div className="flex items-start gap-2.5">
                {logo && (
                  <Image 
                    src={logo} 
                    alt={title} 
                    width={96} 
                    height={96} 
                    className="rounded-sm float-left mr-2.5" 
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies used">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      role="listitem"
                      className="px-2.5 py-1 rounded-sm text-xs font-medium bg-white/2 text-white backdrop-blur-sm border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 text-white/60 text-xs" aria-live="polite">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <span>Click to see features</span>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true">
              <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute inset-0 backface-hidden" 
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            opacity: isFlipped ? 1 : 0,
            transition: 'opacity 0s 0.35s',
          }}
          aria-hidden={!isFlipped}
        >
          <div className="relative w-full h-full rounded-md overflow-hidden">
            {/* Solid fallback bg first — Safari can't reliably render backdrop-blur inside preserve-3d layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#132434]/60 to-[#1e2a35]/80 border border-white/20 shadow-2xl rounded-md" />

            <div className="relative h-full flex flex-col justify-between p-6">
              <div className="flex-1 overflow-y-auto">
                <h4 className="text-lg font-bold text-white mb-3">Features</h4>
                <ul className={`space-y-2 ${logo ? 'columns-2 gap-x-4' : ''}`} role="list">
                  {features.slice(0, 6).map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-300 text-xs break-inside-avoid"
                      role="listitem"
                    >
                      <svg
                        className="w-3 h-3 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex gap-2 items-center" role="group" aria-label="Project links">
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                      aria-label={`View ${title} on GitHub`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  )}

                  {demoUrl && (
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                      aria-label={`Play ${title} demo`}
                    >
                      <img src="/play.svg" alt="" aria-hidden="true" />
                    </a>
                  )}

                  {liveUrl && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                      aria-label={`Launch ${title} app`}
                    >
                      Launch app
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 text-white/60 text-xs" aria-live="polite">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <span>Click to flip back</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
          -webkit-perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
          -webkit-transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}