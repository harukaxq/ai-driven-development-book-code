import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';
import { addArtist } from '$lib/server/addArtist';
import { updateArtist } from '$lib/server/updateArtist';

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
  const artists = await prisma.artist.findMany();
  return json(artists);
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.formData();
  const name = data.get('name') as string;
  const profile = data.get('profile') as string;
  const image = data.get('image') as File;

  const buffer = Buffer.from(await image.arrayBuffer());
  const artist = await addArtist(name, profile, buffer);

  return json(artist);
};

export const PUT: RequestHandler = async ({ request }) => {
  const data = await request.formData();
  const id = Number(data.get('id'));
  const name = data.get('name') as string;
  const profile = data.get('profile') as string;
  const image = data.get('image') as File | null;

  let buffer;
  if (image) {
    buffer = Buffer.from(await image.arrayBuffer());
  }

  const artist = await updateArtist(id, name, profile, buffer);

  return json(artist);
};

export const DELETE: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  await prisma.artist.delete({ where: { id: Number(id) } });
  return new Response('Artist deleted', { status: 200 });
};
