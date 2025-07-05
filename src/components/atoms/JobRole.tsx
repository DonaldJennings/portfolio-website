type JobRoleProps = {
  jobTitle: string;
  className?: string;
};

export default function JobRole({ jobTitle, className = '' }: JobRoleProps) {
  return <h3 className={`text-xl font-semibold text-white ${className}`}>{jobTitle}</h3>;
}
