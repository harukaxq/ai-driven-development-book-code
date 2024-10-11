<script>
  let count = 0;

  function increment() {
    count += 1;
  }

  function decrement() {
    count -= 1;
  }
</script>

<main>
  <h1>カウンター</h1>
  <p>現在のカウント: <span class="font-bold text-red-500">{count}</span></p>
  <button on:click={increment}>増加</button>
  <button on:click={decrement}>減少</button>
</main>
