<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { writable } from 'svelte/store';

  const artists = writable([]);
  const artistName = writable('');
  const artistProfile = writable('');
  const artistImage = writable(null);
  const editingArtistId = writable(null);

  async function fetchArtists() {
    const response = await fetch('/api/artist');
    const data = await response.json();
    artists.set(data);
  }

  async function addArtist() {
    const formData = new FormData();
    formData.append('name', $artistName);
    formData.append('profile', $artistProfile);
    if ($artistImage) {
      formData.append('image', $artistImage);
    }

    await fetch('/api/artist', {
      method: 'POST',
      body: formData,
    });

    await fetchArtists();
    resetForm();
  }

  async function editArtist() {
    const formData = new FormData();
    formData.append('name', $artistName);
    formData.append('profile', $artistProfile);
    if ($artistImage) {
      formData.append('image', $artistImage);
    }

    await fetch(`/api/artist/${$editingArtistId}`, {
      method: 'PUT',
      body: formData,
    });

    await fetchArtists();
    resetForm();
  }

  function resetForm() {
    artistName.set('');
    artistProfile.set('');
    artistImage.set(null);
    editingArtistId.set(null);
  }

  function handleEdit(artist) {
    artistName.set(artist.name);
    artistProfile.set(artist.profile);
    artistImage.set(null);
    editingArtistId.set(artist.id);
  }

  async function handleDelete(id) {
    await fetch(`/api/artist/${id}`, {
      method: 'DELETE',
    });

    await fetchArtists();
  }

  onMount(fetchArtists);
</script>
<main class="p-8 bg-gray-100 min-h-screen">
  <h1 class="text-2xl font-bold mb-6">アーティスト管理</h1>

  <form on:submit|preventDefault={$editingArtistId ? editArtist : addArtist} class="bg-white p-6 rounded-lg shadow-md mb-8">
    <div class="mb-4">
      <label for="name" class="block text-sm font-medium text-gray-700">アーティスト名</label>
      <input type="text" id="name" bind:value={$artistName} required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <div class="mb-4">
      <label for="profile" class="block text-sm font-medium text-gray-700">プロフィール</label>
      <textarea id="profile" bind:value={$artistProfile} required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
    </div>
    <div class="mb-4">
      <label for="image" class="block text-sm font-medium text-gray-700">画像</label>
      <input type="file" id="image" accept="image/*" on:change={(e) => artistImage.set(e.target.files[0])} class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
    </div>
    <div class="flex items-center space-x-4">
      <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{$editingArtistId ? '更新' : '追加'}</button>
      {#if $editingArtistId}
        <button type="button" on:click={resetForm} class="px-4 py-2 bg-gray-600 text-white rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">キャンセル</button>
      {/if}
    </div>
  </form>

  <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アーティスト名</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">プロフィール</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">画像</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {#each $artists as artist}
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">{artist.name}</td>
          <td class="px-6 py-4 whitespace-nowrap">{artist.profile}</td>
          <td class="px-6 py-4 whitespace-nowrap"><img src={artist.image || '/img/artist_default.webp'} alt={artist.name} class="w-12 h-12 rounded-full" /></td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button on:click={() => handleEdit(artist)} class="text-indigo-600 hover:text-indigo-900">編集</button>
            <button on:click={() => handleDelete(artist.id)} class="text-red-600 hover:text-red-900 ml-4">削除</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>


