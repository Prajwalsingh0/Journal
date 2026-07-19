import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || '';
    const filter = searchParams.get('filter') || 'all';
    const topic = searchParams.get('topic') || '';
    const mood = searchParams.get('mood') || '';
    const authorId = searchParams.get('authorId') || '';
    const requesterId = searchParams.get('requesterId') || '';

    if (id) {
      const entry = await db.journalEntry.findUnique({
        where: { id },
        include: {
          author: {
            select: { id: true, name: true, displayName: true, pronouns: true, avatarUrl: true, isAnonymous: true },
          },
          reactions: { select: { type: true } },
          _count: { select: { comments: true } },
        },
      });

      if (!entry) {
        return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
      }

      if (entry.visibility === 'private' && entry.authorId !== requesterId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      const reactionCounts: Record<string, number> = {};
      entry.reactions.forEach((r) => {
        reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
      });

      return NextResponse.json({
        id: entry.id,
        title: entry.title,
        content: entry.content,
        htmlContent: entry.htmlContent,
        mood: entry.mood,
        tags: JSON.parse(entry.tags),
        contentWarnings: JSON.parse(entry.contentWarnings),
        musicMood: entry.musicMood,
        fontStyle: entry.fontStyle,
        visibility: entry.visibility,
        isAnonymous: entry.isAnonymous,
        isDraft: entry.isDraft,
        scheduledAt: entry.scheduledAt,
        createdAt: entry.createdAt.toISOString(),
        authorId: entry.authorId,
        author: entry.isAnonymous
          ? { id: 'anon', name: 'Anonymous', displayName: 'Anonymous Bloomer', pronouns: 'prefer not to say', avatarUrl: null, isAnonymous: true }
          : entry.author,
        reactions: Object.entries(reactionCounts).map(([type, count]) => ({ type, _count: count })),
        commentCount: entry._count.comments,
      });
    }

    const where: any = {
      isDraft: false,
      scheduledAt: null,
    };

    if (authorId) {
      where.authorId = authorId;
      if (authorId !== requesterId) {
        where.visibility = 'public';
      }
    } else {
      where.visibility = 'public';
    }

    if (filter === 'following') {
      where.author = { recvFollows: { some: { followerId: authorId || '' } } };
    } else if (topic) {
      where.tags = { contains: topic };
    }
    if (mood) {
      where.mood = mood;
    }

    const entries = await db.journalEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        author: {
          select: { id: true, name: true, displayName: true, pronouns: true, avatarUrl: true, isAnonymous: true },
        },
        reactions: { select: { type: true } },
        _count: { select: { comments: true } },
      },
    });

    const formatted = entries.map((e) => {
      const reactionCounts: Record<string, number> = {};
      e.reactions.forEach((r) => {
        reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
      });
      return {
        id: e.id,
        title: e.title,
        content: e.content,
        htmlContent: e.htmlContent,
        mood: e.mood,
        tags: JSON.parse(e.tags),
        contentWarnings: JSON.parse(e.contentWarnings),
        musicMood: e.musicMood,
        fontStyle: e.fontStyle,
        visibility: e.visibility,
        isAnonymous: e.isAnonymous,
        isDraft: e.isDraft,
        scheduledAt: e.scheduledAt,
        createdAt: e.createdAt.toISOString(),
        authorId: e.authorId,
        author: e.isAnonymous
          ? { id: 'anon', name: 'Anonymous', displayName: 'Anonymous Bloomer', pronouns: 'prefer not to say', avatarUrl: null, isAnonymous: true }
          : e.author,
        reactions: Object.entries(reactionCounts).map(([type, count]) => ({ type, _count: count })),
        commentCount: e._count.comments,
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch entries' }, { status: 500 });
  }
}

async function fetchMusicTitle(url: string): Promise<string> {
  try {
    if (url.includes('spotify.com')) {
      const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const json = await res.json();
        return json.title || '';
      }
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (res.ok) {
        const json = await res.json();
        return json.title || '';
      }
    }
  } catch (err) {
    console.error('Error fetching music title:', err);
  }
  return '';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, htmlContent, mood, tags, contentWarnings, musicMood, fontStyle, visibility, isAnonymous, isDraft, scheduledAt, authorId, collectionId } = body;

    if (!authorId) {
      return NextResponse.json({ error: 'Author ID is required' }, { status: 400 });
    }

    let finalMusicMood = musicMood || null;
    if (musicMood && (musicMood.includes('spotify.com') || musicMood.includes('youtube.com') || musicMood.includes('youtu.be'))) {
      const songTitle = await fetchMusicTitle(musicMood);
      if (songTitle) {
        finalMusicMood = `${songTitle}|${musicMood}`;
      }
    }

    const entry = await db.journalEntry.create({
      data: {
        title: title || 'Untitled',
        content: content || '',
        htmlContent: htmlContent || content || '',
        mood: mood || 'neutral',
        tags: JSON.stringify(tags || []),
        contentWarnings: JSON.stringify(contentWarnings || []),
        musicMood: finalMusicMood,
        fontStyle: fontStyle || 'sans-serif',
        visibility: visibility || 'public',
        isAnonymous: isAnonymous || false,
        isDraft: isDraft || false,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        collectionId: collectionId || null,
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true, displayName: true, pronouns: true, avatarUrl: true, isAnonymous: true },
        },
        reactions: { select: { type: true } },
        _count: { select: { comments: true } },
      },
    });

    const reactionCounts: Record<string, number> = {};
    entry.reactions.forEach((r) => {
      reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
    });

    return NextResponse.json({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      htmlContent: entry.htmlContent,
      mood: entry.mood,
      tags: JSON.parse(entry.tags),
      contentWarnings: JSON.parse(entry.contentWarnings),
      musicMood: entry.musicMood,
      fontStyle: entry.fontStyle,
      visibility: entry.visibility,
      isAnonymous: entry.isAnonymous,
      isDraft: entry.isDraft,
      scheduledAt: entry.scheduledAt,
      createdAt: entry.createdAt.toISOString(),
      authorId: entry.authorId,
      author: entry.isAnonymous
        ? { id: 'anon', name: 'Anonymous', displayName: 'Anonymous Bloomer', pronouns: 'prefer not to say', avatarUrl: null, isAnonymous: true }
        : entry.author,
      reactions: Object.entries(reactionCounts).map(([type, count]) => ({ type, _count: count })),
      commentCount: entry._count.comments,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create entry' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }
    await db.journalEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete entry' }, { status: 500 });
  }
}