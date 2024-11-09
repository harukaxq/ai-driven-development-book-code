import { PrismaClient } from '@prisma/client';
import { incrementPlayCount } from './incrementPlayCount';

const prisma = new PrismaClient();

describe('incrementPlayCount', () => {
  let songId: number;

  beforeAll(async () => {
    // テスト用のアーティストを作成
    const artist = await prisma.artist.create({
      data: {
        name: 'Test Artist',
        image: '/img/artist_default.webp',
      },
    });

    // テスト用の曲を作成
    const song = await prisma.song.create({
      data: {
        title: 'Test Song',
        artistId: artist.id, // 作成したアーティストのIDを使用
        audio: '/path/to/audio',
        image: '/path/to/image',
      },
    });
    songId = song.id;
  });

  afterAll(async () => {
    // テスト用の曲を削除
    await prisma.song.delete({
      where: { id: songId },
    });

    // テスト用のアーティストを削除
    await prisma.artist.deleteMany({
      where: { name: 'Test Artist' },
    });

    await prisma.$disconnect();
  });

  it('should increment playCount by 1', async () => {
    // 初期のplayCountを取得
    const initialSong = await prisma.song.findUnique({
      where: { id: songId },
    });
    const initialPlayCount = initialSong?.playCount || 0;

    // playCountをインクリメント
    const updatedSong = await incrementPlayCount(songId);

    // playCountが1増加していることを確認
    expect(updatedSong.playCount).toBe(initialPlayCount + 1);
  });
}); 