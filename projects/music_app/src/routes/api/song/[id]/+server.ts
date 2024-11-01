import { json } from '@sveltejs/kit';
import { incrementPlayCount } from '$lib/server/incrementPlayCount';
import type { RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ params }) => {
    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({ error: '曲IDが指定されていません。' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        const updatedSong = await incrementPlayCount(Number(id));
        return json(updatedSong);
    } catch (error) {
        return new Response(JSON.stringify({ error: '再生数の更新中にエラーが発生しました。' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}; 