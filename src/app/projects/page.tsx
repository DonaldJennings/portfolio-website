'use client';

import React, { useState } from 'react';

// Sample projects data
const projects = [
  {
    id: 1,
    title: 'Portfolio Website',
    description:
      'A modern, responsive portfolio website built with Next.js and TypeScript. Features matrix rain animation, glassmorphism design, and smooth navigation.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React'],
    category: 'Web Development',
    status: 'Completed',
    featured: true,
    githubUrl: 'https://github.com/username/portfolio',
    liveUrl: 'https://portfolio.example.com',
    imageUrl: '/placeholder-project-1.jpg',
  },
  {
    id: 2,
    title: 'Task Management System',
    description:
      'A comprehensive task management application with real-time collaboration, project tracking, and team communication features.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Express'],
    category: 'Full Stack',
    status: 'In Progress',
    featured: true,
    githubUrl: 'https://github.com/username/task-manager',
    liveUrl: 'https://taskapp.example.com',
    imageUrl: '/placeholder-project-2.jpg',
  },
  {
    id: 3,
    title: 'Data Visualization Dashboard',
    description:
      'Interactive dashboard for visualizing complex datasets with charts, graphs, and real-time analytics. Built for enterprise data analysis.',
    technologies: ['Python', 'Django', 'D3.js', 'PostgreSQL'],
    category: 'Data Science',
    status: 'Completed',
    featured: false,
    githubUrl: 'https://github.com/username/data-dashboard',
    liveUrl: null,
    imageUrl: '/placeholder-project-3.jpg',
  },
  {
    id: 4,
    title: 'Mobile Fitness App',
    description:
      'Cross-platform mobile application for fitness tracking with workout plans, progress monitoring, and social features.',
    technologies: ['React Native', 'Firebase', 'Redux', 'Node.js'],
    category: 'Mobile Development',
    status: 'Completed',
    featured: false,
    githubUrl: 'https://github.com/username/fitness-app',
    liveUrl: null,
    imageUrl: '/placeholder-project-4.jpg',
  },
  {
    id: 5,
    title: 'AI Chatbot Integration',
    description:
      'Intelligent chatbot system with natural language processing capabilities for customer support automation.',
    technologies: ['Python', 'TensorFlow', 'Flask', 'OpenAI API'],
    category: 'AI/ML',
    status: 'In Progress',
    featured: false,
    githubUrl: 'https://github.com/username/ai-chatbot',
    liveUrl: null,
    imageUrl: '/placeholder-project-5.jpg',
  },
  {
    id: 6,
    title: 'E-commerce Platform',
    description:
      'Modern e-commerce solution with payment processing, inventory management, and admin dashboard.',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'Stripe API'],
    category: 'Web Development',
    status: 'Completed',
    featured: false,
    githubUrl: 'https://github.com/username/ecommerce',
    liveUrl: 'https://shop.example.com',
    imageUrl: '/placeholder-project-6.jpg',
  },
];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Get unique categories and statuses
  const categories = Array.from(new Set(projects.map(project => project.category))).sort();
  const statuses = Array.from(new Set(projects.map(project => project.status))).sort();

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const categoryMatch = !selectedCategory || project.category === selectedCategory;
    const statusMatch = !selectedStatus || project.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const featuredProjects = filteredProjects.filter(project => project.featured);
  const regularProjects = filteredProjects.filter(project => !project.featured);

  const getTechColor = (tech: string) => {
    const colors: { [key: string]: string } = {
      'Next.js': 'bg-blue-600/20 text-blue-300',
      React: 'bg-cyan-600/20 text-cyan-300',
      TypeScript: 'bg-blue-600/20 text-blue-300',
      Python: 'bg-yellow-600/20 text-yellow-300',
      'Node.js': 'bg-green-600/20 text-green-300',
      'Vue.js': 'bg-emerald-600/20 text-emerald-300',
      TensorFlow: 'bg-orange-600/20 text-orange-300',
    };
    return colors[tech] || 'bg-slate-600/20 text-slate-300';
  };

  const getStatusColor = (status: string) => {
    return status === 'Completed'
      ? 'bg-green-600/20 text-green-300 border-green-500/30'
      : 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30';
  };

  return (
    <div className="relative min-h-screen font-mono bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">My Projects</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            A showcase of my work spanning web development, mobile apps, and AI solutions
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Filter by Category</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === null
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Filter by Status</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedStatus(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedStatus === null
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    All Status
                  </button>
                  {statuses.map(status => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedStatus === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Featured Projects</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredProjects.map(project => (
                <div
                  key={project.id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden group hover:border-blue-500/50 transition-all hover:scale-105"
                >
                  <div className="aspect-video bg-slate-700 flex items-center justify-center">
                    <div className="text-slate-400 text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-slate-600 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-sm">Project Preview</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        FEATURED
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                          project.status,
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-300 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map(tech => (
                        <span
                          key={tech}
                          className={`px-2 py-1 text-xs rounded-full ${getTechColor(tech)}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Projects */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            {selectedCategory || selectedStatus ? 'Filtered Projects' : 'All Projects'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularProjects.map(project => (
              <div
                key={project.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden group hover:border-blue-500/50 transition-all hover:scale-105"
              >
                <div className="aspect-video bg-slate-700 flex items-center justify-center">
                  <div className="text-slate-400 text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-slate-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-xs">Preview</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
                      {project.category}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                        project.status,
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-300 mb-4 text-sm line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map(tech => (
                      <span
                        key={tech}
                        className={`px-2 py-1 text-xs rounded-full ${getTechColor(tech)}`}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-slate-600/20 text-slate-300">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Projects Message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
            <p className="text-slate-300">Try adjusting your filters to see more projects.</p>
          </div>
        )}
      </div>
    </div>
  );
}
