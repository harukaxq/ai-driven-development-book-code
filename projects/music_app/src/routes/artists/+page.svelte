<script lang="ts">
  import { onMount } from "svelte";
  import type { Artist } from "@prisma/client";

  let artists: Artist[] = [];

  onMount(async () => {
    const response = await fetch('/api/artist');
    const data = await response.json();
    artists = data;
  });
</script>

{#if artists.length > 0}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each artists as artist}
      <div class="w-full p-4 text-center bg-gray-800 border border-gray-700 rounded-lg shadow sm:p-8">
        <a href={`/artists/${artist.id}`} class="block hover:bg-gray-700">
          <img class="w-full rounded-t-lg" src={artist.image || '/img/artist_default.webp'} alt="アーティスト画像">
          <div class="px-6 py-4">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">{artist.name}</h5>
            <p class="text-gray-400">{artist.profile}</p>
          </div>
        </a>
      </div>
    {/each}
  </div>
{:else}
  <p class="text-center text-gray-300">アーティストが見つかりません。</p>
{/if}
