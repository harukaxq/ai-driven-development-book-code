import { describe, it, expect } from 'vitest';
import { listSong } from './listSong';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('listSong', () => {
  it('should return all songs when no ids are provided', async () => {
    const songs = await listSong();
    const allSongs = await prisma.song.findMany({
      include: { artist: true },
    });

    expect(songs).toHaveLength(allSongs.length);
    expect(songs).toEqual(
      allSongs.map(song => ({
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
      }))
    );
  });

  it('should return specific songs when ids are provided', async () => {
    const specificIds = [1, 2]; // 例としてID 1と2を使用
    const songs = await listSong(specificIds);
    const specificSongs = await prisma.song.findMany({
      where: { id: { in: specificIds } },
      include: { artist: true },
    });

    expect(songs).toHaveLength(specificSongs.length);
    expect(songs).toEqual(
      specificSongs.map(song => ({
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
      }))
    );
  });
});
