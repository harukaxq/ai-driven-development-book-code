import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function addSong(title: string, artistId: number, imageFile: File, audioFile: File) {
  // 画像ファイルと音声ファイルを保存するパスを設定
  const uploadDir = path.join(process.cwd(), 'static', 'uploads');
  const imageFileName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const audioFileName = `${uuidv4()}${path.extname(audioFile.name)}`;
  const imagePath = path.join(uploadDir, imageFileName);
  const audioPath = path.join(uploadDir, audioFileName);

  // 画像ファイルを保存
  const imageBuffer = await imageFile.arrayBuffer();
  fs.writeFileSync(imagePath, Buffer.from(imageBuffer));

  // 音声ファイルを保存
  const audioBuffer = await audioFile.arrayBuffer();
  fs.writeFileSync(audioPath, Buffer.from(audioBuffer));

  // 曲情報をデータベースに保存
  const song = await prisma.song.create({
    data: {
      title,
      image: `/uploads/${imageFileName}`,
      audio: `/uploads/${audioFileName}`,
      artistId,
    },
  });

  return song;
}
