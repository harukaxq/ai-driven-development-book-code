import { addArtist } from './addArtist';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

describe('addArtist', () => {
  it('should add a new artist to the database', async () => {
    const name = 'Test Artist';
    const profile = 'This is a test artist profile';
    const imageBuffer = Buffer.from('test image buffer');

    const artist = await addArtist(name, profile, imageBuffer);

    expect(artist).toHaveProperty('id');
    expect(artist.name).toBe(name);
    expect(artist.profile).toBe(profile);
    expect(artist.image).toContain('/uploads/images/');

    // 画像ファイルが保存されていることを確認
    const imagePath = path.join(__dirname, `../../../static/uploads/images/${artist.image.split('/').pop()}`);
    expect(fs.existsSync(imagePath)).toBe(true);
    // DBに保存されているパスが、/uploads/images/から始まることを確認
    expect(artist.image).toMatch(/^\/uploads\/images\//);

    // データベースからアーティストを削除
    await prisma.artist.delete({ where: { id: artist.id } });
    fs.unlinkSync(imagePath);
  });
});

