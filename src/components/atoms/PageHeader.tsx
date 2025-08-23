type PageHeaderProps = {
  title: string;
  subtitle: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
};

export default function PageHeader({
  title,
  subtitle,
  align = 'left',
  className = '',
}: PageHeaderProps) {
  return (
    <section className={`text-${align} ${className}`}>
      <h1 className="text-2xl md:text-4xl font-bold mb-3 font-sans">{title}</h1>
      <p className="max-w-prose mx-auto text-base md:text-lg opacity-80">{subtitle}</p>
    </section>
  );
}
