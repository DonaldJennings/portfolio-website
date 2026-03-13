import { NextResponse } from 'next/server';
import { getContentStore } from '@/lib/admin/contentStore';

export async function GET() {
  const publications = getContentStore().publications;
  return NextResponse.json({ publications });
}
