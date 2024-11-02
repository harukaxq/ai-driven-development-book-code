import { describe, it, expect } from 'vitest';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { updateSong } from './updateSong';

const prisma = new PrismaClient();

describe('updateSong', () => {
  it('should update a song in the database', async () => {
    // まず曲を追加
    const initialTitle = '初期曲';
    const artistId = 1;
    const initialImageBuffer = Buffer.from('初期画像');
    const initialAudioBuffer = Buffer.from('初期音声');

    const initialSong = await prisma.song.create({
      data: {
        title: initialTitle,
        image: '/uploads/initial_image.jpg',
        audio: '/uploads/initial_audio.mp3',
        artistId: artistId,
      },
    });

    // 曲を更新
    const updatedTitle = '更新曲';
    const updatedImageBuffer = Buffer.from('更新画像');
    const updatedAudioBuffer = Buffer.from('更新音声');

    const updatedSong = await updateSong(initialSong.id, updatedTitle, artistId, updatedImageBuffer, updatedAudioBuffer);

    expect(updatedSong).toHaveProperty('id');
    expect(updatedSong.title).toBe(updatedTitle);
    expect(updatedSong.artistId).toBe(artistId);
    expect(updatedSong.image).toMatch(/\/uploads\/.*\.jpg/);
    expect(updatedSong.audio).toMatch(/\/uploads\/.*\.mp3/);

    // クリーンアップ
    fs.unlinkSync(`./static${updatedSong.image}`);
    fs.unlinkSync(`./static${updatedSong.audio}`);
    await prisma.song.delete({ where: { id: updatedSong.id } });
  });
});
