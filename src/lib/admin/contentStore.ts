import { getDevBlogPostFromMdx, getDevBlogPostsFromMdx, type DevBlogMeta } from '@/lib/devblog';
import { getAllProjectsFromMdx, getProjectFromMdx, type ProjectMeta } from '@/lib/projects';
import { readStoreFile, writeStoreFile } from '@/lib/admin/storeFile';

export type AdminPost = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  excerpt?: string;
  tags?: string[];
  image?: string;
  author?: {
    name: string;
    avatarUrl?: string;
    readingTime?: string;
  };
  content: string;
};

export type AdminProject = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  excerpt?: string;
  tags?: string[];
  image?: string;
  repoUrl?: string;
  demoUrl?: string;
  author?: {
    name: string;
    avatarUrl?: string;
  };
  content: string;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  dates: string;
  description: string;
  skills: string[];
  isCurrent?: boolean;
};

export type EducationEntry = {
  degree: string;
  degreeTitle?: string;
  institution?: string;
  results?: string;
  dateRange?: string;
  description: string[];
  borderColor?: string;
};

export type GithubRepoEntry = {
  owner: string;
  repo: string;
  projectName?: string;
};

export type PublicationEntry = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  url?: string;
  doi?: string;
};

export type AdminContentStore = {
  posts: AdminPost[];
  projects: AdminProject[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  publications: PublicationEntry[];
  githubRepos: GithubRepoEntry[];
};

const defaultExperience: ExperienceEntry[] = [
  {
    company: 'Leonardo UK Ltd',
    role: 'Software Engineer ✈️',
    dates: '2025 - Present',
    description:
      'I design and develop high-assurance software solutions for safety-critical and mission-critical defence systems while mentoring junior engineers and supporting architecture decisions.',
    skills: ['C++', 'C', 'Linux', 'Qt', 'Git', 'Agile', 'System Design'],
    isCurrent: true,
  },
  {
    company: 'Altra ERC',
    role: 'Junior Software Engineer 👨‍🏫',
    dates: '2021 - 2022',
    description:
      'I led development of platform features for an education technology startup across a React frontend, Java backend, and AWS serverless workloads.',
    skills: ['React', 'Node.js', 'JavaScript', 'AWS', 'NoSQL', 'Java'],
  },
];

const defaultEducation: EducationEntry[] = [
  {
    degree: 'BSc (Hons) Computer Science',
    degreeTitle: 'Bachelor of Science (Hons)',
    institution: 'University of Edinburgh',
    results: 'First Class Honours (79%, 4.0 GPA)',
    dateRange: '2020 - 2024',
    description: [
      'Graduated with First Class Honours, specializing in software engineering and system design.',
      'Developed a distributed load-balancing framework for an undergraduate dissertation which was published in the ACM Digital Library.',
      'Recipient of the Edinburgh Award (twice) in recognition of significant professional development and extra-curricular contribution.',
    ],
    borderColor: 'border-blue-500',
  },
];

const defaultPublications: PublicationEntry[] = [
  {
    title: 'Near-Storage Processing in FaaS environments with Funclets',
    authors: 'Alan Nair, Raven Szewczyk, Donald Jennings, Antonio Barbalace',
    venue: 'ACM Digital Library',
    year: '2024',
    url: 'http://dl.acm.org/doi/10.1145/3652892.3700755',
    doi: '10.1145/3652892.3700755',
  },
  {
    title:
      'Breaking the monolith: Dynamic multi-tiered load balancing for scalable serverless computing',
    authors: 'Donald Jennings',
    venue: 'University of Edinburgh Undergraduate Dissertation',
    year: '2024',
    url: 'https://drive.google.com/file/d/11ZHiQSHvoXia47pfWY72DMCQYCDeXCyN/view?usp=drive_link',
    doi: 'N/A',
  },
];

function fromBlogMeta(meta: DevBlogMeta): AdminPost {
  const { content } = getDevBlogPostFromMdx(meta.slug);
  return { ...meta, content };
}

function fromProjectMeta(meta: ProjectMeta): AdminProject {
  const { content } = getProjectFromMdx(meta.slug);
  return { ...meta, content };
}

function createDefaultStore(): AdminContentStore {
  const posts = getDevBlogPostsFromMdx().map(fromBlogMeta);
  const projects = getAllProjectsFromMdx().map(fromProjectMeta);

  return {
    posts,
    projects,
    experience: defaultExperience,
    education: defaultEducation,
    publications: defaultPublications,
    githubRepos: projects
      .filter(project => project.repoUrl?.includes('github.com'))
      .map(project => {
        const match = project.repoUrl?.match(/github\.com\/([^/]+)\/([^/]+)/);
        return match
          ? { owner: match[1], repo: match[2].replace(/\.git$/, ''), projectName: project.title }
          : null;
      })
      .filter((item): item is GithubRepoEntry => item !== null),
  };
}

export function getContentStore(): AdminContentStore {
  const stored = readStoreFile<AdminContentStore>();
  if (stored) {
    // Work with a looser record to safely normalize older persisted shapes
    const result = stored as Partial<AdminContentStore> & Record<string, unknown>;

    const rawEducation = result.education;
    if (!Array.isArray(rawEducation)) {
      result.education = defaultEducation;
    } else {
      const mapped = (rawEducation as unknown as Array<Record<string, unknown>>).map(e => {
        const degree = e.degree ?? '';
        const degreeTitle = e.degreeTitle ?? '';
        const institution = e.institution ?? '';
        const results = e.results ?? '';
        const dateRange = e.dateRange ?? '';
        const descriptionRaw = e.description;
        const description = Array.isArray(descriptionRaw)
          ? (descriptionRaw as unknown[]).map(d => String(d))
          : descriptionRaw
          ? [String(descriptionRaw)]
          : [];
        const borderColor = e.borderColor ?? 'border-green-500';

        return {
          degree: String(degree),
          degreeTitle: String(degreeTitle),
          institution: String(institution),
          results: String(results),
          dateRange: String(dateRange),
          description,
          borderColor: String(borderColor),
        } as EducationEntry;
      });

      result.education = mapped;
    }

    return result as AdminContentStore;
  }

  const initial = createDefaultStore();
  writeStoreFile(initial);
  return initial;
}

export function saveContentStore(store: AdminContentStore) {
  writeStoreFile(store);
}
