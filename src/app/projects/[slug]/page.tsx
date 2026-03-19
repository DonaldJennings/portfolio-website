import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProjectDashboardPage from '@/components/pages/ProjectDashboardPage';
import { getAllProjects, getProject, ProjectMeta } from '@/lib/projects';
import { compileMdx } from '@/lib/compileMDX';
import RadialGradientOverlay from '@/components/atoms/RadialGradientOverlay';

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project: ProjectMeta) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const compiled = project.content ? await compileMdx(project.content) : null;

  return (
    <div className="min-h-screen relative">
      <RadialGradientOverlay />
      <div className="relative z-10 max-w-6xl mx-auto pt-20 pb-12">
        <ProjectDashboardPage meta={project.meta}>
          {compiled}
        </ProjectDashboardPage>
        <nav className="px-4 md:px-8 mt-4">
          <Link
            href="/projects"
            className="text-teal-400 hover:text-teal-300 hover:underline text-sm font-medium transition-colors"
          >
            ← Back to Projects
          </Link>
        </nav>
      </div>
    </div>
  );
}
