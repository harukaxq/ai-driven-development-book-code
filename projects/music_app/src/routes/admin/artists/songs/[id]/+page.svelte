<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  interface Song {
    id: number;
    title: string;
    artistId: number;
    image: string | null;
    audio: string | null;
  }

  let songs: Song[] = [];
  let showModal = false;
  let currentSong: Song = { id: 0, title: '', artistId: 0, image: null, audio: null };
  let artistId: number;

  onMount(async () => {
    artistId = parseInt($page.params.id);
    songs = await fetchSongs(artistId);
  });

  async function fetchSongs(artistId: number): Promise<Song[]> {
    const response = await fetch(`/admin/api/song?artistId=${artistId}`);
    return await response.json();
  }

  async function addSong(song: Song) {
    const formData = new FormData();
    formData.append('title', song.title);
    formData.append('artistId', artistId.toString());
    if (song.image instanceof File) {
      formData.append('image', song.image);
    }
    if (song.audio instanceof File) {
      formData.append('audio', song.audio);
    }

    await fetch('/admin/api/song', {
      method: 'POST',
      body: formData
    });
  }

  async function updateSong(song: Song) {
    const formData = new FormData();
    formData.append('id', song.id.toString());
    formData.append('title', song.title);
    formData.append('artistId', artistId.toString());
    if (song.image instanceof File) {
      formData.append('image', song.image);
    }
    if (song.audio instanceof File) {
      formData.append('audio', song.audio);
    }

    await fetch('/admin/api/song', {
      method: 'PUT',
      body: formData
    });
  }

  async function deleteSong(id: number) {
    await fetch(`/admin/api/song?id=${id}`, {
      method: 'DELETE'
    });
  }

  function openModal(song: Song = { id: 0, title: '', artistId, image: null, audio: null }) {
    currentSong = { ...song };
    showModal = true;
  }

  async function saveSong() {
    if (currentSong.id) {
      await updateSong(currentSong);
    } else {
      await addSong(currentSong);
    }
    showModal = false;
    songs = await fetchSongs(artistId);
  }

  async function removeSong(id: number) {
    await deleteSong(id);
    songs = await fetchSongs(artistId);
  }

  function handleImageChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      currentSong.image = target.files[0];
    }
  }

  function handleAudioChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      currentSong.audio = target.files[0];
    }
  }
</script>

<div class="overflow-x-auto">
  <h1 class="text-2xl font-bold mb-4 text-white">Songs for Artist ID: {artistId}</h1>
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audio</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {#each songs as song}
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">{song.id}</td>
          <td class="px-6 py-4 whitespace-nowrap">{song.title}</td>
          <td class="px-6 py-4 whitespace-nowrap"><img src={song.image || ''} alt={song.title} width="50" /></td>
          <td class="px-6 py-4 whitespace-nowrap">
            {#if song.audio}
              <audio controls src={song.audio}>
                Your browser does not support the audio element.
              </audio>
            {/if}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button class="text-indigo-600 hover:text-indigo-900" on:click={() => openModal(song)}>Edit</button>
            <button class="text-red-600 hover:text-red-900 ml-4" on:click={() => removeSong(song.id)}>Delete</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" on:click={() => openModal()}>Add Song</button>

{#if showModal}
  <div class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form on:submit|preventDefault={saveSong} class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Song Form</h3>
              <div class="mt-2">
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" bind:value={currentSong.title} required class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div class="mt-2">
                <label class="block text-sm font-medium text-gray-700">Image</label>
                <input type="file" on:change={handleImageChange} accept="image/*" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div class="mt-2">
                <label class="block text-sm font-medium text-gray-700">Audio</label>
                <input type="file" on:change={handleAudioChange} accept="audio/*" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">Save</button>
            <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" on:click={() => showModal = false}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
