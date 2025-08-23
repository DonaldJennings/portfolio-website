import JobCard from '@/components/molecules/JobCard';
import type { JobCardProps } from '@/components/molecules/JobCard';

const jobs: JobCardProps[] = [
  {
    company: 'Leonardo UK Ltd',
    roles: [
      {
        title: 'Software Engineer ✈️',
        dates: '2025 - Present',
        description: `I design and develop high-assurance software solutions for safety-critical and mission-critical defence systems, working primarily in modern C++ within the stringent compliance framework of DO-178C.\n\nAs Product Designer, I report directly to the System Architect and hold technical leadership responsibility for the design integrity, quality, and consistency of all software work products delivered by the team. I lead design discussions, perform technical reviews, and ensure alignment with both project requirements and architectural direction.\n\nAlongside my development responsibilities, I mentor two graduate apprentices, providing hands-on support in C++ engineering and guiding their understanding of core Computer Science principles, from system architecture to low-level implementation.`,
        skills: ['C++', 'C', 'Linux', 'Qt', 'Git', 'Agile', 'System Design'],
        isCurrent: true,
      },
      {
        title: 'Graduate Software Engineer',
        dates: '2024 - 2025',
        description: `I contributed to the development of software solutions for defence systems, focusing on modern C++ and adhering to DO-178C compliance standards. I participated in design discussions, code reviews, and collaborated with cross-functional teams to deliver high-quality software products.

        I held responsibility as scrum master for my team, ensuring effective collaboration and timely delivery of project milestones.

        I obtained my Scrum Master certification during this period.

        I also held responsibility as Product Designer (Juniour Architect) for my team, working closely with Solutions Architect to ensure alignment between design and technical implementation.`,
        skills: ['C++', 'Embedded Systems', 'Testing', 'Teamwork'],
      },
      {
        title: 'Undergraduate Software Engineer',
        dates: '2023 - 2024',
        description: `Hired as first undergraduate software engineer in the company. Worked alongside Solution team to develop safety-critical software solutions. Balanced role with final year of undergraduate studies.`,
      },
      {
        title: 'SWE Intern',
        dates: '2023 - 2023',
        description: `Completed a summer internship with Leonardo UK where I led the development of an internal software tool for Mechanical engineers. Cleared backlog of features for this tool and initiated internal release process.`,
        skills: ['C++', 'Python', 'Prototyping', 'Research'],
      },
    ],
  },
  {
    role: 'Junior Software Engineer 👨‍🏫',
    company: 'Altra ERC',
    dates: '2021 - 2022',
    description: `At Altra, an education-technology startup, I led the development of core platform features including a document scraping tool and a resource exporting system, enabling users to ingest and distribute educational content seamlessly through the web platform.

The system was built on a hybrid architecture: a React frontend, a Java-based backend, and a suite of AWS Lambda functions supporting event-driven, serverless processing. I worked closely with senior engineers to define the data schema and shape the backend architecture, focusing on scalability, modularity, and responsiveness.

The infrastructure leveraged services such as API Gateway, S3, and Lambda to orchestrate dynamic workflows and support content-heavy operations. This role gave me end-to-end ownership of feature delivery — from concept and architecture through implementation and deployment — and strengthened my ability to build and integrate cloud-native systems with real-world impact.`,
    skills: ['React', 'Node.js', 'JavaScript', 'AWS', 'NoSQL', 'Java'],
  },
  {
    role: 'Software Quality Assurance Project Lead 🚄',
    company: 'HYPED',
    dates: '2020 - 2021',
    description: `As Project Lead of the Software Quality Assurance team for HYPED — the University of Edinburgh’s award-winning Hyperloop competition entry — I was responsible for managing the weekly operations, technical direction, and strategic alignment of the QA function within a multi-disciplinary engineering team.

I led the design and implementation of automated test suites, set up CI/CD pipelines, and developed scalable testing infrastructure across the software codebase to ensure the robustness, performance, and reliability of mission-critical systems. I drove cross-functional collaboration between software and hardware teams to embed quality assurance early in the development cycle.

I authored the team’s software testing strategy and specification documents, which were submitted as part of the team’s technical entry to international hyperloop competitions, showcasing our systematic approach to verification and validation.

Reporting directly to the Head of Software, I ensured the QA team's efforts remained aligned with project roadmaps, competition deadlines, and engineering priorities. This role sharpened my leadership and technical decision-making skills in a high-pressure, real-world engineering context.`,
    skills: ['C++', 'Test Automation', 'CI/CD', 'Quality Assurance', 'Team Leadership'],
  },
];

export default function ExperienceList() {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800">
      <h2 className="text-2xl font-semibold text-white mb-8">Experience</h2>
      <div className="relative">
        {jobs.map((job, idx) => (
          <JobCard key={job.company + job.role + idx} {...job} />
        ))}
      </div>
    </div>
  );
}
