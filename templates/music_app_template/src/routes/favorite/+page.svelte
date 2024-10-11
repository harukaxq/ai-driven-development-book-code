<script lang="ts">
  import { onMount } from "svelte";
  import type { Song } from "@prisma/client";
  import { getFavorite, removeFromFavorite } from "$lib/module/player";
  import SongCard from "$lib/components/SongCard.svelte";

  let favorite: Song[] = [];

  onMount(async () => {
    const favoriteIds = getFavorite();
    if (favoriteIds.length > 0) {
      const response = await fetch('/api/song?ids=' + favoriteIds.join(','));
      const data = await response.json();
      favorite = data;
    }
  });

</script>
{#if favorite.length > 0}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each favorite as song}
      <SongCard {song} />
    {/each}
  </div>
{:else}
  <p class="text-center text-gray-300">お気に入りに曲がありません。</p>
{/if}