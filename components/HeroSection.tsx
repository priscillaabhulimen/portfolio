'use client';

interface HeroSectionProps {
  name: string;
  title: string;
  description: string;
  avatarUrl?: string;
  contactUrl?: string;
}

export default function HeroSection({
  name,
  title,
  description,
  avatarUrl,
  contactUrl,
}: HeroSectionProps) {
  return (
    <section className="min-h-full px-8 xl:px-24 py-28 mb-18">
      <div className="flex flex-col-reverse lg:flex-row justify-center items-center">
        {/* Textbox area */}
        <div className="pt-40 pb-8 lg:py-8 px-8 w-full -mt-40 lg:mt-0 lg:-mr-32 rounded-md  bg-gradient-to-br from-gray-700/60 to-gray-900/60 backdrop-blur-xl">
          <p className="text-gray-400 text-md">Hi, I'm</p>
          <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
            {name}
          </h1>

          <h2 className="text-xl text-gray-300 font-light mt-2 italic">
            {title}
          </h2>

          <p className="text-gray-400 text-md leading-relaxed max-w-xl mt-6 lg:w-[75%]">
            {description}
          </p>

          <div className="h-8"></div>

          <a
            href={contactUrl}
            className="group relative px-8 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-sm text-white font-medium transition-all duration-300 hover:scale-105 mt-8"
          >
            <span className="relative z-10">Talk to me</span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>

        </div>
        
        {/* Avatar and glow */}
        <div className="relative">
          <div/>
            {/* Avatar container */}
            <div className="backdrop-blur-xl relative w-120 h-120 rounded-full overflow-hidden border-2 border-gray-700  bg-gradient-to-br from-gray-700/60 to-gray-900/60">
               {avatarUrl && (
                 <img
                   src={avatarUrl}
                   alt={name}
                   className="w-full h-full object-cover"
                 />
               )}
            </div>

        </div>
      </div>
    </section>
  );
}
