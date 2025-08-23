import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const projectsDirectory = path.join(process.cwd(), 'src', 'content', 'projects');

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
};

export type Project = {
  meta: ProjectMeta;
  content: string;
};

export function getAllProjects(): ProjectMeta[] {
  if (!fs.existsSync(projectsDirectory)) return [];

  const files = fs.readdirSync(projectsDirectory);
  return files
    .filter(file => file.endsWith('.mdx'))
    .map(filename => {
      const fullPath = path.join(projectsDirectory, filename);
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContent);

      let author;
      if (typeof data.author === 'string') {
        author = { name: data.author };
      } else if (typeof data.author === 'object' && data.author !== null) {
        author = {
          name: data.author.name || '',
          avatarUrl: data.author.avatarUrl || '',
        };
      }

      const image = data.image || '';
      let imageDir = '';
      if (image) {
        const lastSlash = image.lastIndexOf('/');
        imageDir = lastSlash !== -1 ? image.substring(0, lastSlash + 1) : '';
      }
      return {
        title: data.title || filename.replace(/\.mdx$/, ''),
        date: data.date || '',
        slug: filename.replace(/\.mdx$/, ''),
        description: data.description || '',
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        image,
        imageDir,
        repoUrl: data.repoUrl || '',
        demoUrl: data.demoUrl || '',
        author,
      } as ProjectMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getProject(slug: string): Project {
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContent);

  let author;
  if (typeof data.author === 'string') {
    author = { name: data.author };
  } else if (typeof data.author === 'object' && data.author !== null) {
    author = {
      name: data.author.name || '',
      avatarUrl: data.author.avatarUrl || '',
    };
  }

  const image = data.image || '';
  let imageDir = '';
  if (image) {
    const lastSlash = image.lastIndexOf('/');
    imageDir = lastSlash !== -1 ? image.substring(0, lastSlash + 1) : '';
  }
  return {
    meta: {
      title: data.title || slug,
      date: data.date || '',
      slug,
      description: data.description || '',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      image,
      imageDir,
      repoUrl: data.repoUrl || '',
      demoUrl: data.demoUrl || '',
      author,
    },
    content, // raw MDX content
  };
}
