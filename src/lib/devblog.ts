import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'dev-blog');

export type DevBlogMeta = {
  title: string;
  date: string;
  slug: string;
  description?: string;
  tags?: string[];
};

function parseFrontMatter(fileContent: string): {
  data: Record<string, string | string[]>;
  content: string;
} {
  const match = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/m.exec(fileContent);
  if (!match) {
    return { data: {}, content: fileContent };
  }

  const data: Record<string, string | string[]> = {};
  match[1]
    .split('\n')
    .filter(Boolean)
    .forEach(line => {
      const [key, ...rest] = line.split(':');
      const value = rest.join(':').trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        data[key.trim()] = value
          .slice(1, -1)
          .split(',')
          .map(v => v.trim().replace(/^"|"$/g, ''));
      } else {
        data[key.trim()] = value.replace(/^"|"$/g, '');
      }
    });

  return { data, content: match[2] };
}

function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let inCode = false;
  let codeLang = '';
  let listType: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (listType) {
      html.push(listType === 'ul' ? '</ul>' : '</ol>');
      listType = null;
    }
  };

  lines.forEach(rawLine => {
    const line = rawLine.trimEnd();

    if (line.startsWith('```')) {
      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim();
        html.push(
          `<pre class="bg-slate-900 p-4 rounded-lg overflow-x-auto mb-4"><code class="language-${codeLang}">`,
        );
      } else {
        inCode = false;
        html.push('</code></pre>');
      }
      return;
    }

    if (inCode) {
      html.push(line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '\n');
      return;
    }

    if (/^\-\s+/.test(line)) {
      if (listType !== 'ul') {
        closeList();
        listType = 'ul';
        html.push('<ul class="list-disc list-inside mb-4">');
      }
      html.push(`<li>${line.replace(/^\-\s+/, '')}</li>`);
      return;
    }

    if (/^\d+\.\s+/.test(line)) {
      if (listType !== 'ol') {
        closeList();
        listType = 'ol';
        html.push('<ol class="list-decimal list-inside mb-4">');
      }
      html.push(`<li>${line.replace(/^\d+\.\s+/, '')}</li>`);
      return;
    }

    closeList();

    if (/^###\s+/.test(line)) {
      html.push(`<h3 class="text-xl font-semibold mt-6 mb-4">${line.replace(/^###\s+/, '')}</h3>`);
    } else if (/^##\s+/.test(line)) {
      html.push(`<h2 class="text-2xl font-bold mt-8 mb-4">${line.replace(/^##\s+/, '')}</h2>`);
    } else if (/^#\s+/.test(line)) {
      html.push(`<h1 class="text-3xl font-bold mt-8 mb-4">${line.replace(/^#\s+/, '')}</h1>`);
    } else if (line === '') {
      // ignore empty lines
    } else {
      const text = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-slate-900 px-1 py-0.5 rounded">$1</code>');
      html.push(`<p class="mb-4">${text}</p>`);
    }
  });

  closeList();

  return html.join('');
}

export function getDevBlogPosts(): DevBlogMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory);
  return files
    .filter(file => file.endsWith('.mdx'))
    .map(filename => {
      const fullPath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const { data } = parseFrontMatter(fileContent);
      return {
        title: (data.title as string) || filename.replace(/\.mdx$/, ''),
        date: (data.date as string) || '',
        slug: filename.replace(/\.mdx$/, ''),
        description: (data.description as string) || '',
        tags: (data.tags as string[]) || [],
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
      title: (data.title as string) || slug,
      date: (data.date as string) || '',
      slug,
      description: (data.description as string) || '',
      tags: (data.tags as string[]) || [],
    },
    content: markdownToHtml(content),
  };
}
