'use client';

interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
            activeTab === tab
              ? 'bg-white/10 text-white border border-white/20 backdrop-blur-sm scale-105'
              : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
