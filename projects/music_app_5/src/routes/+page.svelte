<script lang="ts">
  import SongCard from '$lib/components/SongCard.svelte';
  import ArtistCard from '$lib/components/ArtistCard.svelte';
  import type { SongWithArtist, ArtistWithSongs } from '$lib/type';

  // サンプルデータ
  const sampleSongs: SongWithArtist[] = [
    {
      id: 1,
      title: 'サンプル曲1',
      image: '',
      audio: '',
      artistId: 1,
      artist: {
        id: 1,
        name: 'サンプルアーティスト1',
        image: '/img/ww.webp',
        profile: null,
      }
    },
    {
      id: 2,
      title: 'サンプル曲2',
      image: '',
      audio: '',
      artistId: 2,
      artist: {
        id: 2,
        name: 'サンプルアーティスト2',
        image: null,
        profile: null,
      }
    }
  ];

  const sampleArtists: ArtistWithSongs[] = [
    {
      id: 1,
      name: 'サンプルアーティスト1',
      image: null,
      profile: 'このアーティストはサンプルです。',
      songs: [sampleSongs[0]]
    },
    {
      id: 2,
      name: 'サンプルアーティスト2',
      image: null,
      profile: 'このアーティストはサンプルです。',
      songs: [sampleSongs[1]]
    }
  ];
</script>

<div class="p-4 space-y-4">
  <h2 class="text-2xl font-bold text-white">アーティスト一覧</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each sampleArtists as artist}
      <ArtistCard artist={artist} />
    {/each}
  </div>

  <h2 class="text-2xl font-bold text-white mt-8">曲一覧</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each sampleSongs as song}
      <SongCard song={song} />
    {/each}
  </div>
</div>
