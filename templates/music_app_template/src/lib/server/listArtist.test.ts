import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { listArtist } from './listArtist';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

describe('listArtist', () => {
  beforeAll(async () => {
    // テスト用のディレクトリを作成
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // テスト用のアーティストと曲を作成
    await prisma.artist.create({
      data: {
        name: 'Test Artist',
        profile: 'This is a test profile.',
        image: '/uploads/test.png',
        songs: {
          create: [
            {
              title: 'Test Song 1',
              audio: '/uploads/test1.mp3',
              image: '/uploads/test1.png',
            },
            {
              title: 'Test Song 2',
              audio: '/uploads/test2.mp3',
              image: '/uploads/test2.png',
            },
          ],
        },
      },
    });
  });

  afterAll(async () => {
    // テストデータを削除
    const testArtist = await prisma.artist.findFirst({
      where: { name: 'Test Artist' },
      include: { songs: true }
    });

    if (testArtist) {
      if (testArtist.songs.length > 0) {
        await prisma.song.deleteMany({
          where: { artistId: testArtist.id }
        });
      }

      await prisma.artist.delete({
        where: { id: testArtist.id }
      });
    }

    // アップロードされたファイルを削除
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    fs.readdirSync(uploadDir).forEach(file => {
      if (file.startsWith('test')) {
        fs.unlinkSync(path.join(uploadDir, file));
      }
    });

    await prisma.$disconnect();
  });

  it('should list all artists with their songs', async () => {
    const artists = await listArtist();

    expect(artists).toBeDefined();
    expect(artists.length).toBeGreaterThan(0);

    const artist = artists.find(a => a.name === 'Test Artist');
    expect(artist).toBeDefined();
    expect(artist?.songs.length).toBe(2);
  });

  it('should list a specific artist with their songs by ID', async () => {
    const testArtist = await prisma.artist.findFirst({
      where: { name: 'Test Artist' },
    });

    if (!testArtist) {
      throw new Error('Test artist not found');
    }

    const artists = await listArtist(testArtist.id);

    expect(artists).toBeDefined();
    expect(artists.length).toBe(1);

    const artist = artists[0];
    expect(artist.name).toBe('Test Artist');
    expect(artist.songs.length).toBe(2);
  });
});
