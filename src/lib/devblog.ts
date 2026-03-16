import { readStoreFile } from '@/lib/admin/storeFile';

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

type StorePost = {
  title: string;
  date: string;
  slug: string;
  description?: string;
  excerpt?: string;
  tags?: string[];
  image?: string;
  author?: { name: string; avatarUrl?: string; readingTime?: string };
  content: string;
};

function toMeta(post: StorePost): DevBlogMeta {
  return {
    title: post.title,
    date: post.date,
    slug: post.slug,
    description: post.description,
    excerpt: post.excerpt,
    tags: post.tags,
    image: post.image,
    imageDir: post.image ? post.image.substring(0, post.image.lastIndexOf('/') + 1) : '',
    author: post.author,
  };
}

export function getDevBlogPosts(): DevBlogMeta[] {
  const store = readStoreFile<{ posts: StorePost[] }>();
  if (!store?.posts?.length) return [];
  return store.posts
    .map(toMeta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getDevBlogPost(slug: string): DevBlogPost | null {
  const store = readStoreFile<{ posts: StorePost[] }>();
  const post = store?.posts.find(p => p.slug === slug);
  if (!post) return null;
  return { meta: toMeta(post), content: post.content };
}
