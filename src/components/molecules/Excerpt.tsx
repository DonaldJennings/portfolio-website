type ExcerptProps = {
  text: string;
  maxLength?: number;
};

export default function Excerpt({ text, maxLength = 160 }: ExcerptProps) {
  const excerpt = text.length > maxLength ? text.slice(0, maxLength).trim() + '…' : text;
  return <p className="text-slate-400 mb-2">{excerpt}</p>;
}
