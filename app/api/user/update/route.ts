import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.address) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { username } = body;
  const user = await prisma.user.update({
    where: { address: session.address },
    data: { username }
  });
  return NextResponse.json(user);
}
