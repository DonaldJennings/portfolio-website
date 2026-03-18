import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import { commitFileToBranch } from '@/lib/admin/githubSync';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
  }

  // Sanitize and prefix filename with timestamp to avoid collisions
  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
  const filename = `${Date.now()}-${sanitized}`;
  const publicPath = `/images/${filename}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Content = buffer.toString('base64');

  const isProd = process.env.NODE_ENV === 'production';
  const githubTokenAvailable = Boolean(process.env.GITHUB_TOKEN);

  try {
    if (isProd && githubTokenAvailable) {
      await commitFileToBranch(`public/images/${filename}`, base64Content, {
        commitMessage: `Admin: upload image ${filename}`,
      });
    } else {
      const fullPath = path.join(process.cwd(), 'public', 'images', filename);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, buffer);
    }

    return NextResponse.json({ path: publicPath });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 },
    );
  }
}
