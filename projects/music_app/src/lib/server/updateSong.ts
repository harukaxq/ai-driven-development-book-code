import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function updateSong(id: number, title: string, imageFile?: File, audioFile?: File) {
  let imagePath = null;
  let audioPath = null;

  if (imageFile) {
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    const imageFilePath = path.join(uploadDir, imageFile.name);

    const imageBuffer = await imageFile.arrayBuffer();
    fs.writeFileSync(imageFilePath, Buffer.from(imageBuffer));

    imagePath = `/static/uploads/${imageFile.name}`;
  }

  if (audioFile) {
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    const audioFilePath = path.join(uploadDir, audioFile.name);

    const audioBuffer = await audioFile.arrayBuffer();
    fs.writeFileSync(audioFilePath, Buffer.from(audioBuffer));

    audioPath = `/static/uploads/${audioFile.name}`;
  }

  const updatedSong = await prisma.song.update({
    where: { id },
    data: {
      title,
      ...(imagePath && { image: imagePath }),
      ...(audioPath && { audio: audioPath }),
    },
  });

  return updatedSong;
}
