type JobCardProps = {
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  description: string;
  isCurrent?: boolean;
  className?: string;
};

export default function JobCard({
  jobTitle,
  companyName,
  startDate,
  endDate,
  description,
  isCurrent = false,
  className = '',
}: JobCardProps) {
  const borderColor = isCurrent ? 'border-green-500' : 'border-slate-700';
  
  return (
    <div className={`${className}`}>
      <div className={`border-l-4 ${borderColor} pl-6 relative`}>
        {isCurrent && (
          <div className="absolute -left-1.5 -top-1 w-2 h-2 bg-green-500 rounded-full">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h3 className="text-xl font-semibold text-white">{jobTitle}</h3>
          {isCurrent && (
            <span className="px-2 py-0.5 text-xs font-medium text-green-400 bg-green-500/10 rounded border border-green-500/30">
              Current
            </span>
          )}
        </div>
        <p className="text-blue-400 font-medium mb-1">{companyName}</p>
        <p className="text-sm text-slate-400 mb-3">
          {startDate} - {endDate ? endDate : 'Present'}
        </p>
        <p className="text-slate-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
