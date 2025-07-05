type JobDescriptionProps = {
  description: string;
  className?: string;
};

export default function JobDescription({ description, className = '' }: JobDescriptionProps) {
  return <p className={`text-slate-300 ${className}`}>{description}</p>;
}
