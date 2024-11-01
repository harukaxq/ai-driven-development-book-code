import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addSong } from '$lib/server/addSong';
import { updateSong } from '$lib/server/updateSong';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ url }) => {
  const artistId = url.searchParams.get('artistId');
  if (!artistId) {
    return json({ error: 'Artist ID is required' }, { status: 400 });
  }

  const songs = await prisma.song.findMany({
    where: { artistId: parseInt(artistId) },
  });

  return json(songs);
};

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const artistId = parseInt(formData.get('artistId') as string);
  const image = formData.get('image') as File;
  const audio = formData.get('audio') as File;

  if (!title || !artistId || !image || !audio) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const audioBuffer = Buffer.from(await audio.arrayBuffer());

  const song = await addSong(title, artistId, imageBuffer, audioBuffer);
  return json(song);
};

export const PUT: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const id = parseInt(formData.get('id') as string);
  const title = formData.get('title') as string;
  const artistId = parseInt(formData.get('artistId') as string);
  const image = formData.get('image') as File | null;
  const audio = formData.get('audio') as File | null;

  if (!id || !title || !artistId) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  let imageBuffer: Buffer | undefined;
  let audioBuffer: Buffer | undefined;

  if (image) {
    imageBuffer = Buffer.from(await image.arrayBuffer());
  }

  if (audio) {
    audioBuffer = Buffer.from(await audio.arrayBuffer());
  }

  const song = await updateSong(id, title, artistId, imageBuffer, audioBuffer);
  return json(song);
};

export const DELETE: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (!id) {
    return json({ error: 'Song ID is required' }, { status: 400 });
  }

  await prisma.song.delete({
    where: { id: parseInt(id) },
  });

  return json({ success: true });
};
