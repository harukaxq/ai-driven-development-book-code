<script lang="ts">
  import type { ArtistWithSongs } from '../type';

  export let artist: ArtistWithSongs;
</script>

<div class="max-w-sm p-4 bg-gray-800 border border-gray-600 rounded-lg shadow">
  <img class="w-full rounded-t-lg" src={artist.image } alt={artist.name} />
  <div class="p-5">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">
      <a href={`/artists/${artist.id}`} class="hover:underline">{artist.name}</a>
    </h5>
  </div>
</div>
