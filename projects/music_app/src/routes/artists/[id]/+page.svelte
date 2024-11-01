<script lang="ts">
  import { onMount } from 'svelte';
  import SongCard from '$lib/components/SongCard.svelte';
  import { page } from '$app/stores';
  let artist = null;
  let songs = [];

  onMount(async () => {
    const { id } = $page.params;
    const response = await fetch(`/api/artist?id=${id}`);
    const data = await response.json();
    artist = data;
    songs = data.songs;
    songs = artist.songs.map(song => ({
      ...song,
      artist: artist
    }));
  });
</script>
{#if !!artist}
<div class="p-6 bg-gray-700">
  <div class="flex items-start mb-6">

    <img src={artist.image} alt="アーティスト画像" class="w-32 h-32 rounded-lg mr-4">
    <div>
      <h1 class="text-3xl font-bold text-white">{artist.name}</h1>
      <p class="text-gray-400">{artist.profile}</p>
    </div>
  </div>

  <h2 class="text-2xl font-bold text-white mb-4">曲一覧</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    {#each songs as song}
      <SongCard {song} />
    {/each}
  </div>
</div>
{/if}
