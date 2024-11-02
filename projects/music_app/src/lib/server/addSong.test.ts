import { describe, it, expect } from 'vitest';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { addSong } from './addSong';

const prisma = new PrismaClient();

describe('addSong', () => {
  it('should add a song to the database', async () => {
    const title = 'テスト曲';
    const artistId = 1;
    const imageBuffer = Buffer.from('テスト画像');
    const audioBuffer = Buffer.from('テスト音声');

    const song = await addSong(title, artistId, imageBuffer, audioBuffer);

    expect(song).toHaveProperty('id');
    expect(song.title).toBe(title);
    expect(song.artistId).toBe(artistId);
    expect(song.image).toMatch(/\/uploads\/.*\.jpg/);
    expect(song.audio).toMatch(/\/uploads\/.*\.mp3/);

    // Clean up
    fs.unlinkSync(`./static${song.image}`);
    fs.unlinkSync(`./static${song.audio}`);
    await prisma.song.delete({ where: { id: song.id } });
  });
});
