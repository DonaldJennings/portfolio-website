import React from 'react';
import ProjectsLandingPage from '../../components/pages/ProjectsLandingPage';
import { getAllProjects } from '@/lib/projects';

export default function ProjectsPage() {
  const projects = getAllProjects();
  return <ProjectsLandingPage projects={projects} />;
}
