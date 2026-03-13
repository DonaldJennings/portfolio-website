import { NextResponse } from 'next/server';
import { getContentStore } from '@/lib/admin/contentStore';

export async function GET() {
  const education = getContentStore().education;
  return NextResponse.json({ education });
}
