import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const prisma = new PrismaClient();

export async function updateSong(id: number, title: string, artistId: number, image?: Buffer, audio?: Buffer) {
  let imageFileName;
  let audioFileName;

  if (image) {
    const imageId = uuidv4();
    imageFileName = `${imageId}.jpg`;
    fs.writeFileSync(`./static/uploads/images/${imageFileName}`, image);
  }

  if (audio) {
    const audioId = uuidv4();
    audioFileName = `${audioId}.mp3`;
    fs.writeFileSync(`./static/uploads/audio/${audioFileName}`, audio);
  }

  // 曲情報をデータベースで更新
  const song = await prisma.song.update({
    where: { id: id },
    data: {
      title: title,
      artist: {
        connect: {
          id: artistId,
        },
      },
      ...(imageFileName && { image: `/uploads/images/${imageFileName}` }),
      ...(audioFileName && { audio: `/uploads/audio/${audioFileName}` }),
    },
  });

  return song;
}
