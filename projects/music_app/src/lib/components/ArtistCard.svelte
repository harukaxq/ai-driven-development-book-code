<script lang="ts">
	import type { Artist } from "@prisma/client";

  export let artist: Artist;
</script>

<div class="w-full p-4 text-center bg-gray-800 border border-gray-700 rounded-lg shadow sm:p-8">
  <a href={`/artists/${artist.id}`} class="block hover:bg-gray-700">
    <img class="w-full rounded-t-lg" src={artist.image} alt="アーティスト画像">
    <div class="px-6 py-4">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">{artist.name}</h5>
    </div>
  </a>
</div>
