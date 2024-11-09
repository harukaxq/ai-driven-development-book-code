import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { listSong } from './listSong';

const prisma = new PrismaClient();

describe('listSong', () => {
  let artistId: number;
  let songId1: number;
  let songId2: number;

  beforeAll(async () => {
    // テスト用のアーティストと曲を作成
    const artist = await prisma.artist.create({
      data: {
        name: 'Test Artist',
        profile: 'This is a test artist.',
        image: '/uploads/test-artist.png',
      },
    });

    artistId = artist.id;

    const song1 = await prisma.song.create({
      data: {
        title: 'Test Song 1',
        image: '/uploads/test-song1.png',
        audio: '/uploads/test-song1.mp3',
        artistId: artist.id,
      },
    });

    const song2 = await prisma.song.create({
      data: {
        title: 'Test Song 2',
        image: '/uploads/test-song2.png',
        audio: '/uploads/test-song2.mp3',
        artistId: artist.id,
      },
    });

    songId1 = song1.id;
    songId2 = song2.id;
  });

  afterAll(async () => {
    // テストデータを削除
    await prisma.song.deleteMany({
      where: { artistId }
    });

    await prisma.artist.delete({
      where: { id: artistId }
    });

    await prisma.$disconnect();
  });

  it('should retrieve songs by specific song IDs', async () => {
    const songs = await listSong([songId1, songId2]);

    expect(songs).toHaveLength(2);
    expect(songs[0].id).toBe(songId1);
    expect(songs[1].id).toBe(songId2);
  });

  it('should retrieve songs by a specific artist ID', async () => {
    const songs = await listSong(undefined, artistId);

    expect(songs).toHaveLength(2);
    expect(songs[0].artistId).toBe(artistId);
    expect(songs[1].artistId).toBe(artistId);
  });

  it('should retrieve all songs when no parameters are provided', async () => {
    const songs = await listSong();

    expect(songs.length).toBeGreaterThanOrEqual(2);
  });
});
