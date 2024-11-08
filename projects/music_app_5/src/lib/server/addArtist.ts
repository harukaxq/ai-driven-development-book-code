import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function addArtist(name: string, profile: string, imageFile: File) {
  // 画像ファイルを保存するパスを設定
  const uploadDir = path.join(process.cwd(), 'static', 'uploads');
  const fileName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const filePath = path.join(uploadDir, fileName);

  // 画像ファイルを保存
  const buffer = await imageFile.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));

  // アーティスト情報をデータベースに保存
  const artist = await prisma.artist.create({
    data: {
      name,
      profile,
      image: `/uploads/${fileName}`,
    },
  });

  return artist;
}
