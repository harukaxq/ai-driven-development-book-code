
import { json } from '@sveltejs/kit';
import { listArtist } from '$lib/server/listArtist';

export async function GET({ url }) {
  const id = url.searchParams.get('id');
  const artistId = id ? parseInt(id, 10) : undefined;

  if (artistId && isNaN(artistId)) {
    return json({ error: 'Invalid artist ID' }, { status: 400 });
  }

  const artists = await listArtist(artistId);

  return json(artists, { status: 200 });
}

