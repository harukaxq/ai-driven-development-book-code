import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ url }) => {
    const songIds = url.searchParams.get('ids');
    if (songIds) {
        let songs = await prisma.song.findMany({
            where: { id: { in: songIds.split(',').map(Number) } },
            include: {
                artist: true,
            }
        });
        songs = songs.sort(() => Math.random() - 0.5); // ランダムに並べ替え
        if (songs) {
            return json(songs);
        } else {
            return new Response('Song not found', { status: 404 });
        }
    } else {
        let songs = await prisma.song.findMany({
            include: {
                artist: true,
            }
        });
        songs = songs.sort(() => Math.random() - 0.5); // ランダムに並べ替え
        return json(songs);
    }
};
