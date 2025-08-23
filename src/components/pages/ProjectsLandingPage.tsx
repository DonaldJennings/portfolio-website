import React from 'react';
import ContentLandingPage from './ContentLandingPage';
import { getAllProjects } from '@/lib/projects';

export default async function ProjectsLandingPage() {
  const rawProjectsPosts = await getAllProjects();

  const projectPosts = rawProjectsPosts.map(project => ({
    slug: project.slug || '',
    title: project.title,
    description: project.description || '',
    date: '', // No date for projects, but required by BlogCard
    tags: project.tags || [],
    author: undefined,
    excerpt: '',
    image: project.image,
  }));

  const allTags = Array.from(new Set(rawProjectsPosts.flatMap(p => p.tags || [])));

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
