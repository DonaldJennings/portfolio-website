type JobDatesProps = {
  dateRange: string;
  className?: string;
};

export default function JobDates({ dateRange, className = '' }: JobDatesProps) {
  return <p className={`text-slate-400 text-sm mb-2 ${className}`}>{dateRange}</p>;
}
