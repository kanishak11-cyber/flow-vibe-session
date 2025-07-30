import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import prisma from '@/lib/prisma';

// Extend Session type to include address
declare module 'next-auth' {
  interface Session {
    address?: string;
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.address) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId, score, earnedPoints } = await req.json();

  if (!sessionId || score === undefined || earnedPoints === undefined) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      endedAt: new Date(),
      score,
      earnedPoints
    }
  });

  await prisma.user.update({
    where: { address: session.address },
    data: { points: { increment: earnedPoints } }
  });

  return NextResponse.json({ success: true, earnedPoints });
}
