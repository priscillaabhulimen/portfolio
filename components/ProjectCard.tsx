'use client';

import { useState } from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  features: string[];
  githubUrl?: string;
  demoUrl?: string;
  logo?: string;
  accentColor?: string;
}

export default function ProjectCard({
  title,
  description,
  tags,
  features,
  githubUrl,
  demoUrl,
  logo,
  accentColor = '#00ff00',
}: ProjectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group perspective-1000 w-full max-w-md h-80 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of Card */}
        <div className="absolute inset-0 backface-hidden">
          <div className="relative w-full h-full rounded-md overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
            {/* Glass background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl" />
            
            {/* Animated gradient overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${accentColor}20 0%, transparent 70%)`,
              }}
            />
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-8">
              <div className="flex items-start gap-4">
                {logo && (
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0"
                    style={{ backgroundColor: accentColor }}
                  >
                    {logo}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white backdrop-blur-sm border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <span>Click to see features</span>
                </div>
              </div>
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            {/* Glass background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-8">
              <div>
                <h4 className="text-xl font-bold text-white mb-4">Features</h4>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-300 text-sm"
                    >
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: accentColor }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </a>
                )}

                {demoUrl && (
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium transition-all duration-300 backdrop-blur-sm border-2 hover:scale-105 shadow-lg"
                    style={{
                      backgroundColor: `${accentColor}30`,
                      borderColor: accentColor,
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Play
                  </a>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 text-white/60 text-sm mt-4">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span>Click to flip back</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
