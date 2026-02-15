'use client';
import SectionHeader from "./SectionHeader";

interface Company {
  name: string;
  logo: string; // URL or emoji
  url?: string;
}

interface CompanyShowcaseProps {
  companies: Company[];
}

export default function CompanyShowcase({ companies }: CompanyShowcaseProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Companies I've Worked With" subtitle="A selection of organizations I've collaborated with." />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {companies.map((company, index) => (
            <a
              key={index}
              href={company.url || '#'}
              target={company.url ? '_blank' : undefined}
              rel={company.url ? 'noopener noreferrer' : undefined}
              className="flex gap-2 py-2 px-6 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300 hover:scale-105 items-center"
            >
              {/* Logo */}
              <div className="w-16 h-16 flex items-center justify-center text-4xl">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Company Name */}
              <p className="text-white font-medium text-md">
                {company.name}
              </p>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-300 pointer-events-none" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
