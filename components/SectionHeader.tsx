interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="text-center space-y-3 mb-12">
      <h2 className="text-4xl md:text-5xl font-bold text-white">{title}</h2>
      {subtitle && (
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
