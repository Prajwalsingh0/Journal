import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { authorId, entryId, type } = await req.json();
    if (!authorId || !entryId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await db.reaction.findUnique({
      where: { authorId_entryId_type: { authorId, entryId, type } },
    });

    if (existing) {
      await db.reaction.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: 'removed' });
    }

    await db.reaction.create({ data: { authorId, entryId, type } });
    return NextResponse.json({ action: 'added' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Reaction failed' }, { status: 500 });
  }
}