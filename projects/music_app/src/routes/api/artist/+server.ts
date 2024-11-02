import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ url }) => {
    const artistId = url.searchParams.get('id');
    if (artistId) {
        const artist = await prisma.artist.findUnique({
            where: { id: Number(artistId) },
            include: {
                songs: true,
            },
        });
        if (artist) {
            return json(artist);
        } else {
            return new Response('Artist not found', { status: 404 });
        }
    } else {
        const artists = await prisma.artist.findMany();
        return json(artists);
    }
};