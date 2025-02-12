import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function incrementPlayCount(songId: number) {
  const updatedSong = await prisma.song.update({
    where: { id: songId },
    data: {
      playCount: {
        increment: 1,
      },
    },
  });

  return updatedSong;
} 