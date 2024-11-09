import { json } from '@sveltejs/kit';
import { addSong } from '$lib/server/addSong';
import { updateSong } from '$lib/server/updateSong';

export const POST = async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get('title');
    const artistId = formData.get('artistId');
    const imageFile = formData.get('image');
    const audioFile = formData.get('audio');

    if (!title || !artistId || !imageFile || !audioFile) {
        return json({ error: 'Invalid input' }, { status: 400 });
    }

    const song = await addSong(title as string, Number(artistId), imageFile as File, audioFile as File);
    return json(song, { status: 201 });
};

export const PUT = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id');
    const title = formData.get('title');
    const imageFile = formData.get('image');
    const audioFile = formData.get('audio');

    if (!id || !title) {
        return json({ error: 'Invalid input' }, { status: 400 });
    }

    const song = await updateSong(Number(id), title as string, imageFile as File, audioFile as File);
    return json(song, { status: 200 });
};
