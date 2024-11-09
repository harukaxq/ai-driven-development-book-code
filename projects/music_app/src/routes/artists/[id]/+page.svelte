<script lang="ts">
  import { onMount } from 'svelte';
  import SongCard from '$lib/components/SongCard.svelte';
  import { page } from '$app/stores';
  import type { ArtistWithSongs, SongWithArtist } from '$lib/type';

  let artist: ArtistWithSongs;
  let songs: SongWithArtist[] = [];

  onMount(async () => {
    const artistId = $page.params.id;
    
    // アーティスト情報を取得
    const artistResponse = await fetch(`/api/artists?id=${artistId}`);
    if (artistResponse.ok) {
      const artistData = await artistResponse.json();
      artist = artistData[0] || {
        id: 0,
        name: '仮のアーティスト',
        profile: 'これは仮のプロフィールです。',
        image: '/img/artist_default.webp',
        songs: []
      };
    }

    // 曲情報を取得
    const songsResponse = await fetch(`/api/songs?artistId=${artistId}`);
    if (songsResponse.ok) {
      songs = await songsResponse.json();
    }
  });
</script>
{#if artist}
<div class="p-6 bg-gray-700">
  <div class="flex items-start mb-6">
    <img src={artist.image || '/img/artist_default.webp'} alt="アーティスト画像" class="w-32 h-32 rounded-lg mr-4">
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
