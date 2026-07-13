import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { reporterId, targetEntryId, reason, description } = await req.json();
    if (!reporterId || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const report = await db.report.create({
      data: {
        reporterId,
        targetEntryId: targetEntryId || null,
        reason,
        description: description || '',
      },
    });

    return NextResponse.json({ id: report.id, status: report.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Report failed' }, { status: 500 });
  }
}