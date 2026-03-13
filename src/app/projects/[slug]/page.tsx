import ContentPostPage from '@/components/pages/ContentPostPage';
import { getAllProjects, getProject, ProjectMeta } from '@/lib/projects';
import { compileMdx } from '@/lib/compileMDX';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project: ProjectMeta) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { content, meta } = await getProject(slug);
  const compiledMdx = await compileMdx(content);

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
      <ContentPostPage meta={metaWithParent}>{compiledMdx}</ContentPostPage>
    </div>
  );
}
