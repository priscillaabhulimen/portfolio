'use client';

import { useState } from 'react';

interface FilterTabsProps {
  tabs: string[];
  activeTab?: string | null;
  onTabChange: (tab: string | null) => void;
}

export default function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
  const [visibleTabs, setVisibleTabs] = useState(tabs.slice(0, 4));


  return (
    <div className="flex flex-wrap gap-3 mb-12">
      {visibleTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab === activeTab ? null : tab)}
          className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all duration-300 ${
            activeTab === tab
              ? 'bg-white/10 text-white border border-white/20 backdrop-blur-sm scale-105'
              : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white'
          }`}
        >
          {tab}
        </button>
      ))}
      <button className='ml-4 text-sm'>
        {visibleTabs.length < tabs.length ? (
          <span
            onClick={() => setVisibleTabs(tabs)}
          >
            See more
          </span>
        ) : (
          <span
            onClick={() => setVisibleTabs(tabs.slice(0, 5))}
          >
            See less
          </span>
        )}
      </button>
    </div>
  );
}
