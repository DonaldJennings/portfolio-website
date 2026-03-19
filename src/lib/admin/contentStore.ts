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

export type ExperienceRole = {
  role: string;
  dates: string;
  description: string;
  skills: string[];
  isCurrent?: boolean;
};

export type ExperienceEntry = {
  company: string;
  logoUrl?: string;
  websiteUrl?: string;
  roles: ExperienceRole[];
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

export type ProfileData = {
  name: string;
  role: string;
  company: string;
  location: string;
  bio: string;
  statusLabel: string;
  avatarUrl?: string;
};

export type HighlightEntry = {
  icon: string;
  label: string;
  sub: string;
};

export type SkillCategoryEntry = {
  title: string;
  skills: string[];
  accent: string;
};

export type AwardEntry = {
  title: string;
  org: string;
  year: string;
  description: string;
};

export type InterestEntry = {
  icon: string;
  label: string;
};

export type AdminContentStore = {
  posts: AdminPost[];
  projects: AdminProject[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  publications: PublicationEntry[];
  githubRepos: GithubRepoEntry[];
  profile: ProfileData;
  highlights: HighlightEntry[];
  skillCategories: SkillCategoryEntry[];
  certifications: string[];
  awards: AwardEntry[];
  interests: InterestEntry[];
};

function createDefaultStore(): AdminContentStore {
  return {
    posts: [],
    projects: [],
    experience: [],
    education: [],
    publications: [],
    githubRepos: [],
    profile: { name: '', role: '', company: '', location: '', bio: '', statusLabel: '' },
    highlights: [],
    skillCategories: [],
    certifications: [],
    awards: [],
    interests: [],
  };
}

export function getContentStore(): AdminContentStore {
  const stored = readStoreFile<AdminContentStore>();
  if (stored) {
    // Work with a looser record to safely normalize older persisted shapes
    const result = stored as Partial<AdminContentStore> & Record<string, unknown>;

    // Migrate experience: old flat {company, role, dates, ...} → new {company, logoUrl, roles[]}
    const rawExperience = result.experience;
    if (Array.isArray(rawExperience)) {
      result.experience = (rawExperience as unknown as Array<Record<string, unknown>>).map(e => {
        if (Array.isArray(e.roles)) {
          // Already new format
          return {
            company: String(e.company ?? ''),
            logoUrl: e.logoUrl ? String(e.logoUrl) : undefined,
            websiteUrl: e.websiteUrl ? String(e.websiteUrl) : undefined,
            roles: (e.roles as Array<Record<string, unknown>>).map(r => ({
              role: String(r.role ?? ''),
              dates: String(r.dates ?? ''),
              description: String(r.description ?? ''),
              skills: Array.isArray(r.skills) ? (r.skills as unknown[]).map(String) : [],
              isCurrent: r.isCurrent === true,
            })),
          } as ExperienceEntry;
        }
        // Old flat format — wrap single role
        return {
          company: String(e.company ?? ''),
          logoUrl: undefined,
          roles: [{
            role: String(e.role ?? ''),
            dates: String(e.dates ?? ''),
            description: String(e.description ?? ''),
            skills: Array.isArray(e.skills) ? (e.skills as unknown[]).map(String) : [],
            isCurrent: e.isCurrent === true,
          }],
        } as ExperienceEntry;
      });
    }

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

    // Ensure new profile fields are always present with defaults
    if (!result.profile || typeof result.profile !== 'object') {
      result.profile = { name: '', role: '', company: '', location: '', bio: '', statusLabel: '' };
    }
    if (!Array.isArray(result.highlights)) result.highlights = [];
    if (!Array.isArray(result.skillCategories)) result.skillCategories = [];
    if (!Array.isArray(result.certifications)) result.certifications = [];
    if (!Array.isArray(result.awards)) result.awards = [];
    if (!Array.isArray(result.interests)) result.interests = [];

    return result as AdminContentStore;
  }

  const initial = createDefaultStore();
  writeStoreFile(initial);
  return initial;
}

export function saveContentStore(store: AdminContentStore) {
  writeStoreFile(store);
}
