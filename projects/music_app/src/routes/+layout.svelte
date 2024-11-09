<script>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
	import Player from '$lib/components/Player.svelte';
</script>

<div class="min-h-screen bg-gray-700">
  <Header />
  <div class="pb-32">
    <slot />
  </div>
  <Player />
</div>