import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'dev-blog');

export type DevBlogMeta = {
  title: string;
  date: string;
  slug: string;
  description?: string;
  excerpt?: string;
  tags?: string[];
  image?: string;
  imageDir?: string;
  author?: {
    name: string;
    avatarUrl?: string;
    readingTime?: string;
  };
};

export type DevBlogPost = {
  meta: DevBlogMeta;
  content: string;
};

export function getDevBlogPosts(): DevBlogMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory);
  return files
    .filter(file => file.endsWith('.mdx'))
    .map(filename => {
      const fullPath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContent);

      let author;
      if (typeof data.author === 'string') {
        author = { name: data.author };
      } else if (typeof data.author === 'object' && data.author !== null) {
        author = {
          name: data.author.name || '',
          avatarUrl: data.author.avatarUrl || '',
          readingTime: data.author.readingTime || '',
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
        author,
      } as DevBlogMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getDevBlogPost(slug: string): DevBlogPost {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContent);

  let author;
  if (typeof data.author === 'string') {
    author = { name: data.author };
  } else if (typeof data.author === 'object' && data.author !== null) {
    author = {
      name: data.author.name || '',
      avatarUrl: data.author.avatarUrl || '',
      readingTime: data.author.readingTime || '',
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
      author,
    },
    content, // raw MDX content
  };
}
