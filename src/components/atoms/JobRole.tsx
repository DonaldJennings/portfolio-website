type JobRoleProps = {
  jobTitle: string;
  className?: string;
  isCurrent?: boolean;
};

export default function JobRole({ jobTitle, className = '', isCurrent = false }: JobRoleProps) {
  return (
    <div className="flex items-center gap-3">
      <h3 className={`text-xl font-semibold text-white ${className}`}>{jobTitle}</h3>
      {isCurrent && (
        <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-xs font-medium">
          Current
        </span>
      )}
    </div>
  );
}
