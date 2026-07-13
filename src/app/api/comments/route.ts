import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const entryId = searchParams.get('entryId');
    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID required' }, { status: 400 });
    }

    const comments = await db.comment.findMany({
      where: { entryId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, name: true, displayName: true, pronouns: true, avatarUrl: true } },
      },
    });

    return NextResponse.json(comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
      author: c.author,
    })));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { authorId, entryId, content } = await req.json();
    if (!authorId || !entryId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const comment = await db.comment.create({
      data: { content, authorId, entryId },
      include: {
        author: { select: { id: true, name: true, displayName: true, pronouns: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      author: comment.author,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create comment' }, { status: 500 });
  }
}