import SectionHeader from '../atoms/SectionTitle';

type SectionProps = {
  title: string;
  bodyText: string;
  children?: React.ReactNode;
  className?: string;
};

export default function SectionWithBackground({
  title,
  bodyText,
  children,
  className = '',
}: SectionProps) {
  return (
    <section
      className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-800   "> ${className}`}
    >
      <SectionHeader title={title} />
      <p className="text-slate-300 space-y-4">{bodyText}</p>
      {children}
    </section>
  );
}
