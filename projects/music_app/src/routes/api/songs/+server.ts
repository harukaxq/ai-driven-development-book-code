import { json } from '@sveltejs/kit';
import { listSong } from '$lib/server/listSong';

export async function GET({ url }) {
  const songIdsParam = url.searchParams.get('songIds');
  const artistIdParam = url.searchParams.get('artistId');

  const songIds = songIdsParam ? songIdsParam.split(',').map(Number).filter(id => !isNaN(id)) : undefined;
  const artistId = artistIdParam ? parseInt(artistIdParam, 10) : undefined;

  if (artistIdParam && isNaN(artistId)) {
    return json({ error: 'Invalid artist ID' }, { status: 400 });
  }

  const songs = await listSong(songIds, artistId);

  return json(songs, { status: 200 });
}
