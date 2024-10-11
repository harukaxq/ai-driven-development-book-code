import { updateArtist } from './updateArtist';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

describe('updateArtist', () => {
  it('should update an existing artist in the database', async () => {
    // テスト用のアーティストを作成
    const artist = await prisma.artist.create({
      data: {
        name: 'Original Artist',
        profile: 'Original Profile',
        image: '/uploads/images/original.jpg',
      },
    });

    const newName = 'Updated Artist';
    const newProfile = 'Updated Profile';
    const imageBuffer = Buffer.from('updated image buffer');

    // アーティストを更新
    const updatedArtist = await updateArtist(artist.id, newName, newProfile, imageBuffer);

    expect(updatedArtist.name).toBe(newName);
    expect(updatedArtist.profile).toBe(newProfile);
    expect(updatedArtist.image).toContain('/uploads/images/');

    // 画像ファイルが保存されていることを確認
    const imagePath = `./static/uploads/images/${updatedArtist.image.split('/').pop()}`;
    expect(fs.existsSync(imagePath)).toBe(true);

    // テスト用のアーティストと画像を削除
    await prisma.artist.delete({ where: { id: artist.id } });
    fs.unlinkSync(imagePath);
  });
});