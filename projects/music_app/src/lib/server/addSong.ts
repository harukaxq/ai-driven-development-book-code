import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const prisma = new PrismaClient();

export async function addSong(title: string, artistId: number, imageBuffer: Buffer, audioBuffer: Buffer) {
  const imageId = uuidv4();
  const audioId = uuidv4();
  const imageFileName = `${imageId}.jpg`;
  const audioFileName = `${audioId}.mp3`;

  fs.writeFileSync(`./static/uploads/${imageFileName}`, imageBuffer);
  fs.writeFileSync(`./static/uploads/${audioFileName}`, audioBuffer);

  // 曲情報をデータベースに保存
  const song = await prisma.song.create({
    data: {
      title: title,
      image: `/uploads/${imageFileName}`,
      audio: `/uploads/${audioFileName}`,
      artistId: artistId,
    },
  });

  return song;
}

