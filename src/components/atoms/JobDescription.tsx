import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type JobDescriptionProps = {
  description: string;
  className?: string;
};

export default function JobDescription({ description, className = '' }: JobDescriptionProps) {
  return (
    <div className={`prose prose-sm prose-invert max-w-none text-slate-300 ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
    </div>
  );
}
