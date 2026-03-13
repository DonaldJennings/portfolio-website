import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Password login is disabled. Use GitHub OAuth at /admin/login.' },
    { status: 410 },
  );
}
