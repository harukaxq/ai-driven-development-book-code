
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ url }) => {
    const songIds = url.searchParams.get('ids');
    if (songIds) {
        const songs = await prisma.song.findMany({
            where: { id: { in: songIds.split(',').map(Number) } },
            include: {
                artist: true,
            },
        });
        if (songs) {
            return json(songs);
        } else {
            return new Response('Song not found', { status: 404 });
        }
    } else {
        const songs = await prisma.song.findMany({
            include: {
                artist: true,
            },
        });
        return json(songs);
    }
};
