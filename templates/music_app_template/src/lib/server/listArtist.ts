import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listArtist(id?: number) {
  if (id) {
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: { songs: true }
    });
    return artist ? [artist] : [];
  } else {
    const artists = await prisma.artist.findMany({
      include: { songs: true }
    });
    return artists;
  }
}


