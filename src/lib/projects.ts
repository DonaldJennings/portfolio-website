import { readStoreFile } from '@/lib/admin/storeFile';

export type ProjectMeta = {
  title: string;
  date: string;
  slug: string;
  description?: string;
  excerpt?: string;
  tags?: string[];
  image?: string;
  imageDir?: string;
  repoUrl?: string;
  demoUrl?: string;
  author?: {
    name: string;
    avatarUrl?: string;
  };
  // Dashboard fields
  status?: 'live' | 'wip' | 'archived';
  stack?: string[];
  role?: 'solo' | 'team' | 'contributor';
  featured?: boolean;
  problem?: string;
  highlights?: string[];
  architectureDiagram?: string;
};

export type Project = {
  meta: ProjectMeta;
  content: string;
};

type StoreProject = {
  title: string;
  date: string;
  slug: string;
  description?: string;
  excerpt?: string;
  tags?: string[];
  image?: string;
  repoUrl?: string;
  demoUrl?: string;
  author?: { name: string; avatarUrl?: string };
  content: string;
  status?: 'live' | 'wip' | 'archived';
  stack?: string[];
  role?: 'solo' | 'team' | 'contributor';
  featured?: boolean;
  problem?: string;
  highlights?: string[];
  architectureDiagram?: string;
};

function toMeta(project: StoreProject): ProjectMeta {
  return {
    title: project.title,
    date: project.date,
    slug: project.slug,
    description: project.description,
    excerpt: project.excerpt,
    tags: project.tags,
    image: project.image,
    imageDir: project.image ? project.image.substring(0, project.image.lastIndexOf('/') + 1) : '',
    repoUrl: project.repoUrl,
    demoUrl: project.demoUrl,
    author: project.author,
    status: project.status,
    stack: project.stack,
    role: project.role,
    featured: project.featured,
    problem: project.problem,
    highlights: project.highlights,
    architectureDiagram: project.architectureDiagram,
  };
}

export function getAllProjects(): ProjectMeta[] {
  const store = readStoreFile<{ projects: StoreProject[] }>();
  if (!store?.projects?.length) return [];
  return store.projects
    .map(toMeta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getProject(slug: string): Project | null {
  const store = readStoreFile<{ projects: StoreProject[] }>();
  const project = store?.projects.find(p => p.slug === slug);
  if (!project) return null;
  return { meta: toMeta(project), content: project.content };
}
