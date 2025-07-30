import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.address) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { tokenId, txHash, metadataUri, name, image } = body;

  // Add validation as needed

  const nft = await prisma.nFT.create({
    data: {
      tokenId,
      contract: process.env.NFT_CONTRACT_ADDRESS!,
      owner: { connect: { address: session.address } },
      metadataUri,
      name,
      image
    }
  });

  return NextResponse.json(nft, { status: 201 });
}
