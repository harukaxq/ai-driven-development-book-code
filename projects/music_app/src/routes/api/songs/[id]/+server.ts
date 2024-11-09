import type { RequestHandler } from '@sveltejs/kit';
import { incrementPlayCount } from '$lib/server/incrementPlayCount';

export const PUT: RequestHandler = async ({ params }) => {
  const songId = parseInt(params.id, 10);

  if (isNaN(songId)) {
    return new Response(JSON.stringify({ error: 'Invalid song ID' }), { status: 400 });
  }

  try {
    await incrementPlayCount(songId);
    return new Response(JSON.stringify({ message: 'Play count incremented successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error incrementing play count:', error);
    return new Response(JSON.stringify({ error: 'Failed to increment play count' }), { status: 500 });
  }
}; 