// Uses the global `fetch` available in the Next.js server/runtime environment.
type Repo = { owner: string; repo: string };

function getRepoFromEnv(): Repo {
  const repoEnv = process.env.GITHUB_REPOSITORY;
  if (repoEnv && repoEnv.includes('/')) {
    const [owner, repo] = repoEnv.split('/');
    return { owner, repo };
  }

  const owner = process.env.GITHUB_OWNER || process.env.GITHUB_REPOSITORY_OWNER;
  const repo = process.env.GITHUB_REPO || process.env.GITHUB_REPOSITORY_NAME;
  if (owner && repo) return { owner, repo };

  throw new Error(
    'GITHUB_REPOSITORY or GITHUB_OWNER/GITHUB_REPO must be set in env to sync to GitHub',
  );
}

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is required to push commits and create PRs');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export async function createBranchCommitAndPR(
  filePath: string,
  fileContent: string,
  options?: { branchPrefix?: string; commitMessage?: string; prTitle?: string; prBody?: string },
) {
  const { owner, repo } = getRepoFromEnv();
  const headers = githubHeaders();

  // 1) Get repo metadata to find default branch
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!repoRes.ok) throw new Error('Failed to get repo info');
  const repoJson = await repoRes.json();
  const defaultBranch = repoJson.default_branch || 'main';

  // 2) Get the commit SHA of default branch
  const refRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${defaultBranch}`,
    { headers },
  );
  if (!refRes.ok) throw new Error('Failed to get default branch ref');
  const refJson = await refRes.json();
  const baseSha = refJson.object?.sha || refJson?.sha;
  if (!baseSha) throw new Error('Unable to determine base commit SHA');

  // 3) Create a branch name
  const prefix = options?.branchPrefix || 'admin/content-update';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const branchName = `${prefix}-${timestamp}`;

  // 4) Create new branch ref
  const createRefRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha }),
  });
  if (!createRefRes.ok) {
    // If branch already exists, continue; otherwise fail
    const body = await createRefRes.text();
    throw new Error(`Failed to create branch: ${createRefRes.status} ${body}`);
  }

  // 5) Update file contents on the new branch using the Contents API
  const contentBase64 = Buffer.from(fileContent, 'utf8').toString('base64');
  const commitMessage = options?.commitMessage || 'Admin: update site content (via admin UI)';

  const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: commitMessage, content: contentBase64, branch: branchName }),
  });

  if (!putRes.ok) {
    const body = await putRes.text();
    throw new Error(`Failed to create/update file via contents API: ${putRes.status} ${body}`);
  }

  // 6) Create a Pull Request
  const prTitle = options?.prTitle || 'Admin content updates';
  const prBody = options?.prBody || 'This PR contains content changes made via the admin UI.';

  const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: prTitle, head: branchName, base: defaultBranch, body: prBody }),
  });

  if (!prRes.ok) {
    const body = await prRes.text();
    throw new Error(`Failed to create PR: ${prRes.status} ${body}`);
  }

  const prJson = await prRes.json();
  return prJson.html_url as string;
}
