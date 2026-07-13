import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const collections = await db.collection.findMany({
      where: { userId },
      include: { _count: { select: { entries: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(collections);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, emoji, userId } = await req.json();
    if (!name || !userId) {
      return NextResponse.json({ error: 'Name and userId required' }, { status: 400 });
    }
    const collection = await db.collection.create({
      data: { name, emoji: emoji || '📝', userId },
    });
    return NextResponse.json(collection);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}