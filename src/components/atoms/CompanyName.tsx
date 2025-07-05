type CompanyNameProps = {
  companyName: string;
  className?: string;
};

export default function CompanyName({ companyName, className = '' }: CompanyNameProps) {
  return <p className={`text-blue-400 font-medium ${className}`}>{companyName}</p>;
}
