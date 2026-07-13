import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    const followingCount = await db.follow.count({ where: { followerId: userId } });
    const followersCount = await db.follow.count({ where: { followingId: userId } });
    const isFollowing = searchParams.get('targetId')
      ? await db.follow.exists({ where: { followerId: userId, followingId: searchParams.get('targetId')! } })
      : false;

    return NextResponse.json({ followingCount, followersCount, isFollowing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { followerId, followingId } = await req.json();
    if (!followerId || !followingId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const existing = await db.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (existing) {
      await db.follow.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: 'unfollowed' });
    }

    await db.follow.create({ data: { followerId, followingId } });
    return NextResponse.json({ action: 'followed' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}