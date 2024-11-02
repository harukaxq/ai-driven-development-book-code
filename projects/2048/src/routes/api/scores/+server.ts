import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { player, points } = await request.json();

    const newScore = await prisma.score.create({
        data: {
            player,
            points
        }
    });

    return json(newScore);
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const topScores = await prisma.score.findMany({
        orderBy: {
            points: 'desc'
        },
        take: 5
    });

    return json(topScores);
}
