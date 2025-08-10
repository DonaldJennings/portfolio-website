import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'dev-blog');

export type DevBlogMeta = {
  title: string;
  date: string;
  slug: string;
};

function parseFrontMatter(fileContent: string): { data: Record<string, string>; content: string } {
  const match = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/m.exec(fileContent);
  if (!match) {
    return { data: {}, content: fileContent };
  }

  const data: Record<string, string> = {};
  match[1]
    .split('\n')
    .filter(Boolean)
    .forEach((line) => {
      const [key, ...rest] = line.split(':');
      data[key.trim()] = rest.join(':').trim().replace(/^"|"$/g, '');
    });

  return { data, content: match[2] };
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n$/gim, '<br />')
    .replace(/\n/g, '<br />');
}

export function getDevBlogPosts(): DevBlogMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((filename) => {
      const fullPath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const { data } = parseFrontMatter(fileContent);
      return {
        title: data.title || filename.replace(/\.mdx$/, ''),
        date: data.date || '',
        slug: filename.replace(/\.mdx$/, ''),
      } as DevBlogMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getDevBlogPost(slug: string): { meta: DevBlogMeta; content: string } {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = parseFrontMatter(fileContent);
  return {
    meta: {
      title: data.title || slug,
      date: data.date || '',
      slug,
    },
    content: markdownToHtml(content),
  };
}
