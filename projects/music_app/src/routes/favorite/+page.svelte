<script lang="ts">
  import { onMount } from 'svelte';
  import SongCard from '$lib/components/SongCard.svelte';
  import { favoriteIds } from '$lib/module/favorite';
  import { get } from 'svelte/store';
  import type { SongWithArtist } from '$lib/type';

  let favoriteSongs: SongWithArtist[] = [];
  let message = '';

  onMount(async () => {
    const ids = get(favoriteIds);
    if (ids.length === 0) {
      message = 'お気に入りに追加されている曲はありません';
      return;
    }

    const response = await fetch(`/api/songs`);
    if (response.ok) {
      const allSongs: SongWithArtist[] = await response.json();
      favoriteSongs = allSongs.filter(song => ids.includes(song.id));
    } else {
      message = '曲情報の取得に失敗しました';
    }
  });
</script>

<div class="p-6 bg-gray-700">
  {#if favoriteSongs.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#each favoriteSongs as song}
        <SongCard {song} />
      {/each}
    </div>
  {:else}
    <p class="text-white">{message}</p>
  {/if}
</div>
