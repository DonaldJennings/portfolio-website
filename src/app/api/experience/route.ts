import { NextResponse } from 'next/server';
import { getContentStore } from '@/lib/admin/contentStore';

export async function GET() {
  const experience = getContentStore().experience;
  return NextResponse.json({ experience });
}
