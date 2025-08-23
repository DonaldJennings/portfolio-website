import React from 'react';
import { projects } from '@/content/projects';
import ContentLandingPage from './ContentLandingPage';

// Convert projects to the BlogPost shape expected by BlogLandingPage
const projectPosts = projects.map(project => ({
  slug: project.slug || '',
  title: project.title,
  description: project.description || '',
  date: '', // No date for projects, but required by BlogCard
  tags: project.tags || [],
  author: undefined,
  excerpt: '',
  image: project.image,
}));

const allTags = Array.from(new Set(projects.flatMap(p => p.tags || [])));

export default function ProjectsLandingPage() {
  // Custom hero section padding for projects
  return (
    <ContentLandingPage
      title="Projects"
      subtitle="A collection of my personal and professional projects."
      searchPlaceholder="Search projects..."
      baseContentPath="/projects"
      posts={projectPosts}
      tags={allTags}
    />
  );
}
