interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="space-y-3 mb-2 mt-8">
      <h2 className="text-4xl md:text-5xl font-medium text-white">{title}</h2>
      {subtitle && (
        <p className="text-gray-400 text-md lg:text-lg max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
