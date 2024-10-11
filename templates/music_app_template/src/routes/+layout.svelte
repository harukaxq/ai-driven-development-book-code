<script>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
	import PlayerWidget from '$lib/components/PlayerWidget.svelte';
</script>
<div class="min-h-screen bg-gray-700 flex flex-col">

<Header />

<div class="container mx-auto p-4 flex-grow mb-44">
  <slot />
</div>

<PlayerWidget />

</div>
