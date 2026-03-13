import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import { getContentStore, saveContentStore, type AdminContentStore } from '@/lib/admin/contentStore';

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

  saveContentStore(payload);
  return NextResponse.json({ ok: true });
}
