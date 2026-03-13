import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import {
  getContentStore,
  saveContentStore,
  type AdminContentStore,
} from '@/lib/admin/contentStore';
import { createBranchCommitAndPR } from '@/lib/admin/githubSync';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(getContentStore());
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await request.json()) as AdminContentStore;

  if (!payload || !Array.isArray(payload.posts) || !Array.isArray(payload.projects)) {
    return NextResponse.json({ error: 'Invalid payload shape' }, { status: 400 });
  }

  // If running in production with a GitHub token, create a branch, commit the
  // updated admin content file, and open a Pull Request for review.
  // Otherwise (development), persist locally as before.
  const isProd = process.env.NODE_ENV === 'production';
  const githubTokenAvailable = Boolean(process.env.GITHUB_TOKEN);

  try {
    if (isProd && githubTokenAvailable) {
      const filePath = 'src/data/admin-content.json';
      const json = JSON.stringify(payload, null, 2);
      const prUrl = await createBranchCommitAndPR(filePath, json, {
        branchPrefix: 'admin-content-update',
        commitMessage: 'Admin: update site content (via admin UI)',
        prTitle: 'Admin content updates',
        prBody: 'Content updates made through the admin portal. Please review before merging.',
      });

      return NextResponse.json({ ok: true, prUrl });
    }

    // Fallback for local/dev: write to disk immediately
    saveContentStore(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to persist content' },
      { status: 500 },
    );
  }
}
