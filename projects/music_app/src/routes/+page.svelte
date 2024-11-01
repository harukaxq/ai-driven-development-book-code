<script lang="ts">
	import ArtistCard from "$lib/components/ArtistCard.svelte";
	import SongCard from "$lib/components/SongCard.svelte";
	import { onMount } from "svelte";
	import type { SongWithArtist } from "../type";
	import type { Artist } from "@prisma/client";
	let artists: Artist[] = [];
	let songs: SongWithArtist[] = [];

	onMount(async () => {
		const artistResponse = await fetch('/api/artist');
		const artistData = await artistResponse.json();
		artists = artistData;

		const songResponse = await fetch('/api/song');
		const songData = await songResponse.json();
		songs = songData;
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="text-3xl font-bold mb-4 text-white">アーティスト一覧</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each artists as artist}
			<ArtistCard {artist} />
		{/each}
	</div>

	<h1 class="text-3xl font-bold mt-8 mb-4 text-white">曲一覧</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each songs as song}
			<SongCard {song} />
		{/each}
	</div>
</div>
