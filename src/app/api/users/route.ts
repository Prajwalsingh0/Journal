import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, name: true, displayName: true, pronouns: true,
        customPronoun: true, bio: true, avatarUrl: true, coverUrl: true,
        theme: true, interests: true, isUnder18: true, createdAt: true,
        _count: { select: { entries: true, sentFollows: true, recvFollows: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      interests: JSON.parse(user.interests),
      createdAt: user.createdAt.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, displayName, pronouns, customPronoun, bio, interests, theme } = body;

    const data: any = {};
    if (displayName !== undefined) data.displayName = displayName;
    if (pronouns !== undefined) data.pronouns = pronouns;
    if (customPronoun !== undefined) data.customPronoun = customPronoun;
    if (bio !== undefined) data.bio = bio;
    if (interests !== undefined) data.interests = JSON.stringify(interests);
    if (theme !== undefined) data.theme = theme;

    const user = await db.user.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      id: user.id,
      displayName: user.displayName,
      pronouns: user.pronouns,
      customPronoun: user.customPronoun,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      theme: user.theme,
      interests: JSON.parse(user.interests),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}