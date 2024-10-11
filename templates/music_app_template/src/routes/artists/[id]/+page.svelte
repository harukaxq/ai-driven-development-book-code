<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { get } from "svelte/store";
  import type {  SongWithArtist } from "../../../type";
  import type { Artist } from "@prisma/client";
  import ArtistCard from "$lib/components/ArtistCard.svelte";
  import SongCard from "$lib/components/SongCard.svelte";

  let artist: Artist;
  let songs: SongWithArtist[] = [];

  onMount(async () => {
    const artistId = get(page).params.id;
    const artistResponse = await fetch(`/api/artist?id=${artistId}`);
    artist = await artistResponse.json();

    const songResponse = await fetch(`/api/song?artistId=${artistId}`);
    songs = await songResponse.json();
  });
</script>

{#if artist}
<div class="container mx-auto p-4">
  <div class="flex justify-center mb-8">
    <ArtistCard {artist} />
  </div>

  <h1 class="text-3xl font-bold mb-4">曲一覧</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each songs as song}
      <SongCard {song} />
    {/each}
  </div>
</div>
{/if}
