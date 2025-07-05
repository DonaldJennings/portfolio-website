type SectionTitleProps = {
  title: string;
  className?: string;
};

export default function SectionHeader({ title, className = '' }: SectionTitleProps) {
  return <h2 className={`text-2xl font-semibold text-white mb-4 ${className}`}>{title}</h2>;
}
