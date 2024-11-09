import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { addSong } from './addSong';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

describe('addSong', () => {
  const testImageBuffer = Buffer.from('dummy image content');
  const testAudioBuffer = Buffer.from('dummy audio content');
  let artistId: number;

  beforeAll(async () => {
    // テスト用のディレクトリを作成
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // テスト用のアーティストを作成
    const artist = await prisma.artist.create({
      data: {
        name: 'Test Artist',
        profile: 'This is a test artist.',
        image: '/uploads/test-artist.png',
      },
    });

    artistId = artist.id;
  });

  afterAll(async () => {
    // テストデータを削除
    await prisma.song.deleteMany({
      where: { artistId }
    });

    await prisma.artist.delete({
      where: { id: artistId }
    });

    // アップロードされたファイルを削除
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    fs.readdirSync(uploadDir).forEach(file => {
      if (file.startsWith('test')) {
        fs.unlinkSync(path.join(uploadDir, file));
      }
    });

    await prisma.$disconnect();
  });

  it('should add a new song to the database', async () => {
    const testImageFile = new File([testImageBuffer], 'test.png', {
      type: 'image/png',
      lastModified: new Date().getTime(),
    });

    const testAudioFile = new File([testAudioBuffer], 'test.mp3', {
      type: 'audio/mpeg',
      lastModified: new Date().getTime(),
    });

    // エラー対策のためにFile.prototype.arrayBufferを上書き
    testImageFile.arrayBuffer = async function() {
      return testImageBuffer.buffer;
    };

    testAudioFile.arrayBuffer = async function() {
      return testAudioBuffer.buffer;
    };

    const song = await addSong('Test Song', artistId, testImageFile, testAudioFile);

    expect(song).toBeDefined();
    expect(song.title).toBe('Test Song');
    expect(song.image).toMatch(/^\/uploads\/[a-f0-9-]+\.png$/);
    expect(song.audio).toMatch(/^\/uploads\/[a-f0-9-]+\.mp3$/);
  });
});
