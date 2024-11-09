import { json } from '@sveltejs/kit';
import { addArtist } from '$lib/server/addArtist';
import { updateArtist } from '$lib/server/updateArtist.js';

export const POST = async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name');
    const profile = formData.get('profile');
    const imageFile = formData.get('image');

    if (!name || !profile || !imageFile) {
        return json({ error: 'Invalid input' }, { status: 400 });
    }
    try {
        const artist = await addArtist(name as string, profile as string, imageFile as File);
        return json(artist, { status: 201 });
    } catch (error) {
        console.error(error);
        return json({ error: 'Failed to add artist' }, { status: 500 });
    }
};

export const PUT = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id');
    const name = formData.get('name');
    const profile = formData.get('profile');
    const imageFile = formData.get('image');

    if (!id || !name || !profile || !imageFile) {
        return json({ error: 'Invalid input' }, { status: 400 });
    }
    try {
        const artist = await updateArtist(Number(id), name as string, profile as string, imageFile as File);
        return json(artist, { status: 200 });
    } catch (error) {
        console.error(error);
        return json({ error: 'Failed to update artist' }, { status: 500 });
    }
};
