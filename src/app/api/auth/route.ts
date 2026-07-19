import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, displayName, pronouns, customPronoun, isUnder18 } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!isUnder18 && typeof isUnder18 !== 'boolean') {
      return NextResponse.json({ error: 'Age verification is required' }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const user = await db.user.create({
      data: {
        email: cleanEmail,
        password,
        name: name || null,
        displayName: displayName || name || null,
        pronouns: pronouns || 'she/her',
        customPronoun: customPronoun || null,
        isUnder18,
        interests: '[]',
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      displayName: user.displayName,
      pronouns: user.pronouns,
      customPronoun: user.customPronoun,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      theme: user.theme,
      interests: JSON.parse(user.interests),
      isUnder18: user.isUnder18,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Sign up failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await db.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
    }
    if (user.password !== password) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      displayName: user.displayName,
      pronouns: user.pronouns,
      customPronoun: user.customPronoun,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      theme: user.theme,
      interests: JSON.parse(user.interests),
      isUnder18: user.isUnder18,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}