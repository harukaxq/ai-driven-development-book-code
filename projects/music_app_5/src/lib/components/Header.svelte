<script lang="ts">
  import { page } from '$app/stores';
  import { get } from 'svelte/store';

  const currentPage = get(page);
</script>

<header class="bg-gray-800 text-white p-4 flex justify-between items-center">
  <div class="text-2xl">
    <a href="/" class="hover:underline">🚀</a>
  </div>
  <nav>
    <ul class="flex space-x-4">
      <li>
        <a href="/" class="hover:underline">ホーム</a>
      </li>
      <li>
        <a href="/favorite" class="hover:underline">お気に入り</a>
      </li>
    </ul>
  </nav>
</header>
