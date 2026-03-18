// Uses the global `fetch` available in the Next.js server/runtime environment.
type Repo = { owner: string; repo: string };

async function getDefaultBranch(owner: string, repo: string, headers: Record<string, string>) {
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!repoRes.ok) throw new Error('Failed to get repo info');
  const repoJson = await repoRes.json();
  return repoJson.default_branch || 'main';
}

async function ensureBranch(
  owner: string,
  repo: string,
  headers: Record<string, string>,
  branchName: string,
  baseSha: string,
) {
  const branchRefUrl = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branchName}`;
  const branchCheckRes = await fetch(branchRefUrl, { headers });
  if (!branchCheckRes.ok) {
    if (branchCheckRes.status === 404) {
      const createRefRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha }),
      });
      if (!createRefRes.ok) {
        const body = await createRefRes.text();
        throw new Error(`Failed to create branch: ${createRefRes.status} ${body}`);
      }
    } else {
      const body = await branchCheckRes.text();
      throw new Error(`Failed to check branch existence: ${branchCheckRes.status} ${body}`);
    }
  }
}

async function commitFileOnBranch(
  owner: string,
  repo: string,
  headers: Record<string, string>,
  filePath: string,
  base64Content: string,
  branchName: string,
  commitMessage: string,
) {
  let existingFileSha: string | undefined;
  const getContentsRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branchName}`,
    { headers },
  );
  if (getContentsRes.ok) {
    const contentsJson = await getContentsRes.json();
    if (contentsJson && typeof contentsJson === 'object' && 'sha' in contentsJson) {
      existingFileSha = String(contentsJson.sha);
    }
  } else if (getContentsRes.status !== 404) {
    const body = await getContentsRes.text();
    throw new Error(`Failed to check existing file contents: ${getContentsRes.status} ${body}`);
  }

  const putBody: Record<string, unknown> = {
    message: commitMessage,
    content: base64Content,
    branch: branchName,
  };
  if (existingFileSha) putBody.sha = existingFileSha;

  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(putBody),
    },
  );
  if (!putRes.ok) {
    const body = await putRes.text();
    throw new Error(`Failed to create/update file via contents API: ${putRes.status} ${body}`);
  }
}

/**
 * Commit a binary file (already base64-encoded) to the admin-content-update branch.
 * Does not create a PR — images are committed alongside the content JSON update.
 */
export async function commitFileToBranch(
  filePath: string,
  base64Content: string,
  options?: { branchName?: string; commitMessage?: string },
) {
  const { owner, repo } = getRepoFromEnv();
  const headers = githubHeaders();
  const branchName = options?.branchName || 'admin-content-update';
  const commitMessage = options?.commitMessage || `Admin: upload file ${filePath}`;

  const defaultBranch = await getDefaultBranch(owner, repo, headers);
  const refRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${defaultBranch}`,
    { headers },
  );
  if (!refRes.ok) throw new Error('Failed to get default branch ref');
  const refJson = await refRes.json();
  const baseSha = refJson.object?.sha || refJson?.sha;
  if (!baseSha) throw new Error('Unable to determine base commit SHA');

  await ensureBranch(owner, repo, headers, branchName, baseSha);
  await commitFileOnBranch(owner, repo, headers, filePath, base64Content, branchName, commitMessage);
}

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
  options?: {
    branchPrefix?: string;
    branchName?: string;
    commitMessage?: string;
    prTitle?: string;
    prBody?: string;
  },
) {
  const { owner, repo } = getRepoFromEnv();
  const headers = githubHeaders();

  const defaultBranch = await getDefaultBranch(owner, repo, headers);

  const refRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${defaultBranch}`,
    { headers },
  );
  if (!refRes.ok) throw new Error('Failed to get default branch ref');
  const refJson = await refRes.json();
  const baseSha = refJson.object?.sha || refJson?.sha;
  if (!baseSha) throw new Error('Unable to determine base commit SHA');

  const prefix = options?.branchPrefix || 'admin-content-update';
  const branchName = options?.branchName || prefix;

  await ensureBranch(owner, repo, headers, branchName, baseSha);

  const contentBase64 = Buffer.from(fileContent, 'utf8').toString('base64');
  const commitMessage = options?.commitMessage || 'Admin: update site content (via admin UI)';
  await commitFileOnBranch(owner, repo, headers, filePath, contentBase64, branchName, commitMessage);

  // Create or reuse a Pull Request for the branch
  const prTitle = options?.prTitle || 'Admin content updates';
  const prBody = options?.prBody || 'This PR contains content changes made via the admin UI.';

  // Check for existing open PR where head is this branch
  const prsRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?head=${owner}:${branchName}&state=open`,
    { headers },
  );
  if (!prsRes.ok) throw new Error('Failed to check existing pull requests');
  const prs = await prsRes.json();
  if (Array.isArray(prs) && prs.length > 0) {
    // Reuse the first open PR
    return prs[0].html_url as string;
  }

  // Create a new PR if none exists
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
