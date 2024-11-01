import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const prisma = new PrismaClient();

export async function addArtist(name: string, profile: string, imageBuffer: Buffer) {
  const imageId = uuidv4();
  const imageFileName = `${imageId}.jpg`;

  fs.writeFileSync(`./static/uploads/images/${imageFileName}`, imageBuffer);

  // アーティスト情報をデータベースに保存
  const artist = await prisma.artist.create({
    data: {
      name: name,
      profile: profile,
      image: `/uploads/images/${imageFileName}`,
    },
  });

  return artist;
}

