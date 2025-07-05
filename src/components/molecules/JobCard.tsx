type JobCardProps = {
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  description: string;
  className?: string;
};

export default function JobCard({
  jobTitle,
  companyName,
  startDate,
  endDate,
  description,
  className = '',
}: JobCardProps) {
  return (
    <div className={`p-4 bg-gray-800 rounded-lg shadow-md ${className}`}>
      <h3 className="text-xl font-semibold text-white">{jobTitle}</h3>
      <p className="text-blue-400 font-medium">{companyName}</p>
      <p className="text-sm text-slate-400">
        {startDate} - {endDate ? endDate : 'Present'}
      </p>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}
