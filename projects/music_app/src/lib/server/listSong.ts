import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listSong(ids?: number[]) {
  const songs = await prisma.song.findMany({
    where: ids ? { id: { in: ids } } : {},
    include: {
      artist: true,
    },
  });

  return songs.map(song => ({
    id: song.id,
    title: song.title,
    image: song.image || '/img/song_default.webp',
    audio: song.audio,
    artistId: song.artistId,
    createdAt: song.createdAt,
    updatedAt: song.updatedAt,
    artist: {
      id: song.artist.id,
      name: song.artist.name,
      profile: song.artist.profile,
      image: song.artist.image || '/img/artist_default.webp',
      createdAt: song.artist.createdAt,
      updatedAt: song.artist.updatedAt,
    },
  }));
}