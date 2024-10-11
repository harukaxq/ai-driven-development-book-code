import { addSong } from './addSong';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

describe('uploadSong', () => {
  it('should upload a new song to the database', async () => {
    const title = 'Test Song';
    const artist = await prisma.artist.create({
      data: {
        name: 'Test Artist',
        profile: 'Test Profile',
        image: '/uploads/images/test.jpg',
      },
    });
    const artistId = artist.id;
    const imageBuffer = Buffer.from('test image buffer');
    const audioBuffer = Buffer.from('test audio buffer');

    const song = await addSong(title, artistId, imageBuffer, audioBuffer);

    expect(song).toHaveProperty('id');
    expect(song.title).toBe(title);
    expect(song.image).toContain('/uploads/images/');
    expect(song.audio).toContain('/uploads/audio/');

    // 画像と音声ファイルが保存されていることを確認
    const imagePath = path.join(__dirname, `../../../static/uploads/images/${song.image.split('/').pop()}`);
    const audioPath = path.join(__dirname, `../../../static/uploads/audio/${song.audio.split('/').pop()}`);
    expect(fs.existsSync(imagePath)).toBe(true);
    expect(fs.existsSync(audioPath)).toBe(true);

    // データベースから曲を削除
    await prisma.song.delete({ where: { id: song.id } });
    fs.unlinkSync(imagePath);
    fs.unlinkSync(audioPath);
  });
});
