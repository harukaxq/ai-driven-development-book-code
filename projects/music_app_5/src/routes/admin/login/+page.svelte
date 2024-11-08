<script>
  let secretKey = '';

  import { page } from '$app/stores';
  const errorMessage = $page.url.searchParams.get('error') || '';
  
</script>

<div class="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded shadow">
  {#if errorMessage}
    <div class="mb-4 text-red-500">{errorMessage}</div> <!-- エラーメッセージを表示 -->
  {/if}
  <form method="POST" >
    <div class="mb-4">
      <label for="secretKey" class="block text-sm font-medium text-gray-700 dark:text-gray-300">シークレットキー</label>
      <input type="password" id="secretKey" name="key" bind:value={secretKey} class="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:text-white" required>
    </div>
    <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">ログイン</button>
  </form>
</div>