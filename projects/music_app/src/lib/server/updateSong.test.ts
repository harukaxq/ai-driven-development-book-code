import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { updateSong } from './updateSong';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

describe('updateSong', () => {
  const testImageBuffer = Buffer.from('dummy image content');
  const testAudioBuffer = Buffer.from('dummy audio content');
  let artistId: number;
  let songId: number;

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

    // テスト用の曲を作成
    const song = await prisma.song.create({
      data: {
        title: 'Original Title',
        image: '/uploads/original.png',
        audio: '/uploads/original.mp3',
        artistId: artist.id,
      },
    });

    songId = song.id;
  });

  afterAll(async () => {
    // テストデータを削除
    await prisma.song.delete({
      where: { id: songId }
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

  it('should update the song title', async () => {
    const updatedSong = await updateSong(songId, 'Updated Title');

    expect(updatedSong).toBeDefined();
    expect(updatedSong.title).toBe('Updated Title');
  });

  it('should update the song image and audio', async () => {
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

    const updatedSong = await updateSong(songId, 'Updated Title', testImageFile, testAudioFile);

    expect(updatedSong).toBeDefined();
    expect(updatedSong.image).toMatch(/^\/static\/uploads\/test\.png$/);
    expect(updatedSong.audio).toMatch(/^\/static\/uploads\/test\.mp3$/);
  });
});
