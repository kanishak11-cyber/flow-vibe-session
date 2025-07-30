import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.address) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { nftId, price } = await req.json();

  if (!nftId || !price) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const nft = await prisma.nFT.findUnique({ where: { id: nftId } });
  if (!nft || nft.ownerId !== session.id) {
    return NextResponse.json({ error: "You don't own this NFT." }, { status: 403 });
  }

  const listing = await prisma.listing.create({
    data: {
      nft: { connect: { id: nftId } },
      seller: { connect: { address: session.address } },
      price: Number(price),
      isActive: true
    }
  });

  return NextResponse.json(listing, { status: 201 });
}
