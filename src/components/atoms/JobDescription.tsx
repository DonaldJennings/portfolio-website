type JobDescriptionProps = {
  description: string;
  className?: string;
};

export default function JobDescription({ description, className = '' }: JobDescriptionProps) {
  // First try to split by double line breaks, then by single line breaks, then by sentences for very long text
  let paragraphs = description.split('\n\n').filter(paragraph => paragraph.trim().length > 0);

  // If no double line breaks found, try single line breaks
  if (paragraphs.length === 1) {
    paragraphs = description.split('\n').filter(paragraph => paragraph.trim().length > 0);
  }

  // If still one long paragraph, split by sentences for better readability
  if (paragraphs.length === 1 && description.length > 300) {
    const sentences = description.split('. ');
    const chunks = [];
    let currentChunk = '';

    sentences.forEach((sentence, index) => {
      const sentenceToAdd = index === sentences.length - 1 ? sentence : sentence + '.';

      if (currentChunk.length + sentenceToAdd.length > 250) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentenceToAdd + ' ';
      } else {
        currentChunk += sentenceToAdd + ' ';
      }
    });

    if (currentChunk.trim()) chunks.push(currentChunk.trim());
    paragraphs = chunks.length > 1 ? chunks : paragraphs;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-slate-300 leading-relaxed text-sm">
          {paragraph.trim()}
        </p>
      ))}
    </div>
  );
}
