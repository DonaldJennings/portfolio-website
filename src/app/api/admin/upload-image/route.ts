import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import { commitFileToBranch } from '@/lib/admin/githubSync';
import path from 'path';
import fs from 'fs';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/** Verify file is a real image by inspecting magic bytes, not the browser-reported MIME type. */
function isValidImageBuffer(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  const isGif = buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38;
  // WebP: "RIFF????WEBP"
  const isWebp =
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50;
  return isPng || isJpeg || isGif || isWebp;
}

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

  // Enforce size limit before reading the full buffer into memory
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 413 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Validate actual image format via magic bytes, not the browser-supplied MIME type
  if (!isValidImageBuffer(buffer)) {
    return NextResponse.json(
      { error: 'Unsupported file type. Only PNG, JPEG, GIF, and WebP are accepted.' },
      { status: 415 },
    );
  }

  // Sanitize and prefix filename with timestamp to avoid collisions
  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
  const filename = `${Date.now()}-${sanitized}`;
  const publicPath = `/images/${filename}`;
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
