import fs from 'fs';
import path from 'path';

// Static import so webpack/Next.js bundles the JSON directly into the server
// bundle — this guarantees it's always available in production regardless of
// how the serverless runtime resolves process.cwd().
import bundledContent from '../../data/admin-content.json';

export const storePath = path.join(process.cwd(), 'src', 'data', 'admin-content.json');

export function readStoreFile<T>() {
  if (process.env.NODE_ENV === 'production') {
    // Use the bundled-at-build-time copy. Netlify rebuilds on every merge, so
    // content updated via the admin PR workflow is always up to date.
    return bundledContent as unknown as T;
  }

  // Development: read from disk so local admin edits are reflected immediately
  // without restarting the dev server.
  if (!fs.existsSync(storePath)) return null;
  const raw = fs.readFileSync(storePath, 'utf8');
  return JSON.parse(raw) as T;
}

export function writeStoreFile<T>(data: T) {
  // Ensure the directory exists so writing the JSON file never fails due to missing folders.
  const dir = path.dirname(storePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf8');
}
