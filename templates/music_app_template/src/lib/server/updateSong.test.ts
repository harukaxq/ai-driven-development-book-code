import { updateSong } from './updateSong';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

describe('updateSong', () => {
  it('should update an existing song in the database', async () => {
    // テスト用のアーティストと曲を作成
    const artist = await prisma.artist.create({
      data: {
        name: 'Test Artist',
        profile: 'Test Profile',
        image: '/uploads/images/test.jpg',
      },
    });

    const song = await prisma.song.create({
      data: {
        title: 'Original Song',
        artistId: artist.id,
        image: '/uploads/images/original.jpg',
        audio: '/uploads/audio/original.mp3',
      },
    });

    const newTitle = 'Updated Song';
    const imageBuffer = Buffer.from('updated image buffer');
    const audioBuffer = Buffer.from('updated audio buffer');

    // 曲を更新
    const updatedSong = await updateSong(song.id, newTitle, artist.id, imageBuffer, audioBuffer);

    expect(updatedSong.title).toBe(newTitle);
    expect(updatedSong.image).toContain('/uploads/images/');
    expect(updatedSong.audio).toContain('/uploads/audio/');

    // 画像と音声ファイルが保存されていることを確認
    const imagePath = `./static/uploads/images/${updatedSong.image.split('/').pop()}`;
    const audioPath = `./static/uploads/audio/${updatedSong.audio.split('/').pop()}`;
    expect(fs.existsSync(imagePath)).toBe(true);
    expect(fs.existsSync(audioPath)).toBe(true);

    // テスト用の曲、アーティスト、ファイルを削除
    await prisma.song.delete({ where: { id: song.id } });
    await prisma.artist.delete({ where: { id: artist.id } });
    fs.unlinkSync(imagePath);
    fs.unlinkSync(audioPath);
  });
});
