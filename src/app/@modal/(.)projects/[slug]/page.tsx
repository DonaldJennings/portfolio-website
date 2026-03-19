import { notFound } from 'next/navigation';
import { getAllProjects, getProject, ProjectMeta } from '@/lib/projects';
import { compileMdx } from '@/lib/compileMDX';
import ProjectOverlay from '@/components/organisms/ProjectOverlay';
import ProjectDashboardPage from '@/components/pages/ProjectDashboardPage';

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project: ProjectMeta) => ({ slug: project.slug }));
}

export default async function InterceptedProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const compiled = project.content ? await compileMdx(project.content) : null;

  return (
    <ProjectOverlay>
      <ProjectDashboardPage meta={project.meta}>
        {compiled}
      </ProjectDashboardPage>
    </ProjectOverlay>
  );
}
