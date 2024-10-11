import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const prisma = new PrismaClient();

export async function addSong(title: string, artistId: number, image: Buffer, audio: Buffer) {
  const imageId = uuidv4();
  const audioId = uuidv4();
  const imageFileName = `${imageId}.jpg`;
  const audioFileName = `${audioId}.mp3`;

  // 画像と音声ファイルを保存
  fs.writeFileSync(`./static/uploads/images/${imageFileName}`, image);
  fs.writeFileSync(`./static/uploads/audio/${audioFileName}`, audio);

  // 曲情報をデータベースに保存
  const song = await prisma.song.create({
    data: {
      artist: {
        connect: {
          id: artistId,
        },
      },
      title: title,
      image: `/uploads/images/${imageFileName}`, // ここを相対パスに変更
      audio: `/uploads/audio/${audioFileName}`, // ここを相対パスに変更
    },
  });

  return song;
}
