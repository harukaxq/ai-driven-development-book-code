<script lang="ts">
	import { onMount } from "svelte";


	let isFavorite = false;

	onMount(() => {
	});

	function handlePlay() {
	}

	function handleAddToFavorite() {
	}

	function handleRemoveFromFavorite() {
	}

	function toggleFavorite() {
		if (isFavorite) {
			handleRemoveFromFavorite();
		} else {
			handleAddToFavorite();
		}
		isFavorite = !isFavorite;
	}
</script>

<div class="max-w-sm p-4 bg-gray-800 border border-gray-600 rounded-lg shadow">
  <img class="w-full rounded-t-lg" src="" alt="アルバムアート">
  <div class="p-5">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">曲のタイトル</h5>
    <p class="mb-3 font-normal text-gray-400">
      <a href={`/artists/1`} class="text-gray-400 hover:underline">アーティスト名</a>
    </p>
    <div class="flex justify-between items-center">
      <button on:click={handlePlay} class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-6.586-3.793A1 1 0 007 8.118v7.764a1 1 0 001.166.943l6.586-3.793a1 1 0 000-1.764z" />
        </svg>
        <span class="ml-2">再生</span>
      </button>
      <button on:click={toggleFavorite} class={isFavorite ? "inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300" : "inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300"}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={isFavorite ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
        </svg>
        <span class="ml-2">{isFavorite ? "削除" : "追加"}</span>
      </button>
    </div>
  </div>
</div>
