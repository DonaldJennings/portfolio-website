import { ProjectCardProps } from '../components/molecules/ProjectCard';

export const projects: ProjectCardProps[] = [
  {
    title: 'Portfolio Website',
    description: 'A modern, responsive portfolio built with Next.js, React, and Tailwind CSS.',
    image: '/images/funclets-card-image.png',
    tags: ['Next.js', 'React', 'Tailwind CSS'],
    slug: 'portfolio-website',
  },
  {
    title: 'Funclets: Serverless Functions',
    description: 'A platform for running lightweight serverless functions at the edge.',
    image: '/images/circuit-board.svg',
    tags: ['Serverless', 'Edge', 'Platform'],
    slug: 'funclets-serverless-functions',
  },
  // Add more projects as needed
];
