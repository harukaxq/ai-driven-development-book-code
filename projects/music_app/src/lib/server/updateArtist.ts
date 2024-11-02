import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const prisma = new PrismaClient();

export async function updateArtist(id: number, name: string, profile: string, imageBuffer?: Buffer) {
  let imageFileName;
  if (imageBuffer) {
    const imageId = uuidv4();
    imageFileName = `${imageId}.jpg`;
    fs.writeFileSync(`./static/uploads/images/${imageFileName}`, imageBuffer);
  }

  // アーティスト情報をデータベースで更新
  const artist = await prisma.artist.update({
    where: { id: id },
    data: {
      name: name,
      profile: profile,
      ...(imageFileName && { image: `/uploads/images/${imageFileName}` }),
    },
  });

  return artist;
}