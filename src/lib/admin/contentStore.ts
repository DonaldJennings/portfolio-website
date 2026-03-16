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

function createDefaultStore(): AdminContentStore {
  return {
    posts: [],
    projects: [],
    experience: [],
    education: [],
    publications: [],
    githubRepos: [],
  };
}

export function getContentStore(): AdminContentStore {
  const stored = readStoreFile<AdminContentStore>();
  if (stored) {
    // Work with a looser record to safely normalize older persisted shapes
    const result = stored as Partial<AdminContentStore> & Record<string, unknown>;

    const rawEducation = result.education;
    if (!Array.isArray(rawEducation)) {
      result.education = [];
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
