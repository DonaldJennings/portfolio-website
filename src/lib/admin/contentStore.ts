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

export type GithubRepoEntry = {
  owner: string;
  repo: string;
  projectName?: string;
};

export type AdminContentStore = {
  posts: AdminPost[];
  projects: AdminProject[];
  experience: ExperienceEntry[];
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
  if (stored) return stored;

  const initial = createDefaultStore();
  writeStoreFile(initial);
  return initial;
}

export function saveContentStore(store: AdminContentStore) {
  writeStoreFile(store);
}
