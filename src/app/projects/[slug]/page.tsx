import { notFound } from 'next/navigation';
import ContentPostPage from '@/components/pages/ContentPostPage';
import { getAllProjects, getProject, ProjectMeta } from '@/lib/projects';

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project: ProjectMeta) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { content, meta } = project;

  const metaWithParent = {
    ...meta,
    title: meta?.title || 'Untitled Project',
    date: 'N/A',
    parent: {
      title: 'Projects',
      slug: 'projects',
      href: '/projects',
    },
  };

  return (
    <div className="min-h-screen relative">
      <ContentPostPage meta={metaWithParent}>{content}</ContentPostPage>
    </div>
  );
}
