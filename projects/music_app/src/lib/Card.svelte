<script>
  export let songName;
  export let artwork;
  export let artistName;
</script>

<div class="card bg-white text-black p-4 rounded-md border border-gray-300">
  <img src={artwork} alt="Album Cover" class="rounded-md mb-4" style="width: 100%; object-fit: cover;" />
  <h3 class="text-lg font-semibold mb-2">{songName}</h3>
  <p class="text-sm text-muted-foreground">{artistName}</p>
</div>

<style>
  .card {
    max-width: 300px;
  }
</style>
