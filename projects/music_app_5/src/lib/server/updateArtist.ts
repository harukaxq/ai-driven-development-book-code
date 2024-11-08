import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function updateArtist(id: number, name: string, profile: string, imageFile?: File) {
  let imagePath = null;

  if (imageFile) {
    // 画像ファイルを保存するパスを設定
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    const filePath = path.join(uploadDir, imageFile.name);

    // 画像ファイルを保存
    const buffer = await imageFile.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    imagePath = `/static/uploads/${imageFile.name}`;
  }

  // アーティスト情報をデータベースで更新
  const updatedArtist = await prisma.artist.update({
    where: { id },
    data: {
      name,
      profile,
      ...(imagePath && { image: imagePath }),
    },
  });

  return updatedArtist;
}
