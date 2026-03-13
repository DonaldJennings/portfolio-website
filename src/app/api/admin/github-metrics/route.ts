import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import { getContentStore } from '@/lib/admin/contentStore';

type GithubIssue = {
  state: 'open' | 'closed';
  pull_request?: unknown;
  created_at: string;
  closed_at: string | null;
};

async function fetchRepoIssues(owner: string, repo: string) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`,
    { headers, next: { revalidate: 300 } },
  );

  if (!response.ok) {
    throw new Error(`GitHub API error for ${owner}/${repo}: ${response.status}`);
  }

  const issues = (await response.json()) as GithubIssue[];
  return issues.filter(item => !item.pull_request);
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const repos = getContentStore().githubRepos;

  try {
    const metrics = await Promise.all(
      repos.map(async repo => {
        const issues = await fetchRepoIssues(repo.owner, repo.repo);
        const openIssues = issues.filter(issue => issue.state === 'open');
        const closedIssues = issues.filter(issue => issue.state === 'closed');

        const avgCloseTimeDays =
          closedIssues.length > 0
            ? closedIssues.reduce((sum, issue) => {
                if (!issue.closed_at) return sum;
                const opened = new Date(issue.created_at).getTime();
                const closed = new Date(issue.closed_at).getTime();
                return sum + (closed - opened) / (1000 * 60 * 60 * 24);
              }, 0) / closedIssues.length
            : 0;

        return {
          ...repo,
          totalIssues: issues.length,
          openIssues: openIssues.length,
          closedIssues: closedIssues.length,
          completionRate:
            issues.length > 0 ? Math.round((closedIssues.length / issues.length) * 100) : 0,
          avgCloseTimeDays: Number(avgCloseTimeDays.toFixed(1)),
        };
      }),
    );

    return NextResponse.json({ metrics });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch GitHub metrics' },
      { status: 500 },
    );
  }
}
