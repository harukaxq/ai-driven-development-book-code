<script lang="ts">
  import { onMount } from 'svelte';
  import SongCard from '$lib/components/SongCard.svelte';
  import ArtistCard from '$lib/components/ArtistCard.svelte';
  import type { SongWithArtist, ArtistWithSongs } from '$lib/type';

  let artists: ArtistWithSongs[] = [];
  let songs: SongWithArtist[] = [];

  onMount(async () => {
    try {
      const artistResponse = await fetch('/api/artists/');
      if (artistResponse.ok) {
        artists = await artistResponse.json();
      } else {
        console.error('Failed to fetch artists');
      }

      const songResponse = await fetch('/api/songs/');
      if (songResponse.ok) {
        songs = await songResponse.json();
      } else {
        console.error('Failed to fetch songs');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
</script>

<div class="p-4 space-y-8">
  <h2 class="text-2xl font-bold text-white">アーティスト一覧</h2>
  <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
    {#each artists as artist}
      <ArtistCard artist={artist} />
    {/each}
  </div>

  <h2 class="text-2xl font-bold text-white mt-8">曲一覧</h2>
  <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
    {#each songs as song}
      <SongCard song={song} />
    {/each}
  </div>
</div>
