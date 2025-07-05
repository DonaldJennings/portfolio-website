import JobCard from '@/components/molecules/JobCard';

export default function ExperienceList() {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800">
      <h2 className="text-2xl font-semibold text-white mb-6">Experience</h2>
      <div className="space-y-6">
        <JobCard
          jobTitle="Software Engineer"
          startDate="2023"
          endDate="Present"
          companyName="Leonardo UK Ltd"
          description="Developed and maintain software solutions for complex safety-critical systems. Held technical leadership role as Product Designer where I am responsible for the techincal quality of team deliverables. Technical mentor to two apprentices."
          isCurrent={true}
        />

        <JobCard
          jobTitle="Junior Software Engineer"
          startDate="2021"
          endDate="2022"
          companyName="Altra ERC"
          description="Focused on developing and maintaining web applications and internal tools. Gained hands-on experience"
        />

        <JobCard
          jobTitle="Software Quality Assurance Project Lead"
          startDate="2020"
          endDate="2021"
          companyName="HYPED"
          description="Led a team in ensuring software quality through rigorous testing and validation processes. Developed automated test suites and implemented best practices to enhance product reliability and performance."
        />
      </div>
    </div>
  );
}
