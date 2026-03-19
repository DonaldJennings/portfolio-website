import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import { getContentStore } from '@/lib/admin/contentStore';

type GithubIssue = {
  state: 'open' | 'closed';
  pull_request?: unknown;
  created_at: string;
  closed_at: string | null;
};

type GithubPR = {
  state: 'open' | 'closed';
  merged_at: string | null;
};

type GithubRepoInfo = {
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  pushed_at: string;
  open_issues_count: number;
  default_branch: string;
};

function makeHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: makeHeaders(), next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

async function fetchAllPages<T>(baseUrl: string): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  while (true) {
    const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}per_page=100&page=${page}`;
    const res = await fetch(url, { headers: makeHeaders(), next: { revalidate: 300 } });
    if (!res.ok) break;
    const data = (await res.json()) as T[];
    results.push(...data);
    if (data.length < 100) break;
    page++;
  }
  return results;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const repos = getContentStore().githubRepos;

  if (repos.length === 0) {
    return NextResponse.json({ metrics: [], summary: null });
  }

  try {
    const metrics = await Promise.all(
      repos.map(async repo => {
        const base = `https://api.github.com/repos/${repo.owner}/${repo.repo}`;

        const [info, allIssuesAndPRs, allPRs] = await Promise.all([
          fetchJSON<GithubRepoInfo>(base),
          fetchAllPages<GithubIssue>(`${base}/issues?state=all`),
          fetchAllPages<GithubPR>(`${base}/pulls?state=all`),
        ]);

        const issues = allIssuesAndPRs.filter(i => !i.pull_request);
        const openIssues = issues.filter(i => i.state === 'open');
        const closedIssues = issues.filter(i => i.state === 'closed');

        const avgCloseTimeDays =
          closedIssues.length > 0
            ? closedIssues.reduce((sum, issue) => {
                if (!issue.closed_at) return sum;
                return sum + (new Date(issue.closed_at).getTime() - new Date(issue.created_at).getTime()) / 86_400_000;
              }, 0) / closedIssues.length
            : 0;

        const openPRs = allPRs.filter(p => p.state === 'open').length;
        const mergedPRs = allPRs.filter(p => p.merged_at !== null).length;

        return {
          owner: repo.owner,
          repo: repo.repo,
          projectName: repo.projectName,
          description: info.description ?? '',
          stars: info.stargazers_count,
          forks: info.forks_count,
          watchers: info.watchers_count,
          language: info.language,
          lastPush: info.pushed_at,
          defaultBranch: info.default_branch,
          totalIssues: issues.length,
          openIssues: openIssues.length,
          closedIssues: closedIssues.length,
          completionRate: issues.length > 0 ? Math.round((closedIssues.length / issues.length) * 100) : 0,
          avgCloseTimeDays: Number(avgCloseTimeDays.toFixed(1)),
          openPRs,
          mergedPRs,
          totalPRs: allPRs.length,
        };
      }),
    );

    const summary = {
      totalStars: metrics.reduce((s, m) => s + m.stars, 0),
      totalForks: metrics.reduce((s, m) => s + m.forks, 0),
      totalIssuesClosed: metrics.reduce((s, m) => s + m.closedIssues, 0),
      totalIssuesOpen: metrics.reduce((s, m) => s + m.openIssues, 0),
      totalMergedPRs: metrics.reduce((s, m) => s + m.mergedPRs, 0),
      avgCompletionRate:
        metrics.length > 0
          ? Math.round(metrics.reduce((s, m) => s + m.completionRate, 0) / metrics.length)
          : 0,
    };

    return NextResponse.json({ metrics, summary });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch GitHub metrics' },
      { status: 500 },
    );
  }
}
