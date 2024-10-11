<script lang="ts">
  import { onMount } from 'svelte';

  interface Artist {
    id: number;
    name: string;
    profile: string;
    image: string | null;
  }

  let artists: Artist[] = [];
  let showModal = false;
  let currentArtist: Artist = { id: 0, name: '', profile: '', image: null };

  onMount(async () => {
    artists = await fetchArtists();
  });

  async function fetchArtists(): Promise<Artist[]> {
    const response = await fetch('/admin/api/artist');
    return await response.json();
  }

  async function addArtist(artist: Artist) {
    const formData = new FormData();
    formData.append('name', artist.name);
    formData.append('profile', artist.profile);
    if (artist.image) {
      formData.append('image', artist.image);
    }

    await fetch('/admin/api/artist', {
      method: 'POST',
      body: formData
    });
  }

  async function updateArtist(artist: Artist) {
    const formData = new FormData();
    formData.append('id', artist.id.toString());
    formData.append('name', artist.name);
    formData.append('profile', artist.profile);
    if (artist.image) {
      formData.append('image', artist.image);
    }

    await fetch('/admin/api/artist', {
      method: 'PUT',
      body: formData
    });
  }

  async function deleteArtist(id: number) {
    await fetch(`/admin/api/artist?id=${id}`, {
      method: 'DELETE'
    });
  }

  function openModal(artist: Artist = { id: 0, name: '', profile: '', image: null }) {
    currentArtist = { ...artist };
    showModal = true;
  }

  async function saveArtist() {
    if (currentArtist.id) {
      await updateArtist(currentArtist);
    } else {
      await addArtist(currentArtist);
    }
    showModal = false;
    artists = await fetchArtists(); // 更新後のアーティスト一覧を再取得
  }

  async function removeArtist(id: number) {
    await deleteArtist(id);
    artists = await fetchArtists(); // 削除後のアーティスト一覧を再取得
  }

  function handleImageChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      currentArtist.image = target.files[0];
    }
  }
</script>

<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Songs</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {#each artists as artist}
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">{artist.id}</td>
          <td class="px-6 py-4 whitespace-nowrap">{artist.name}</td>
          <td class="px-6 py-4 whitespace-nowrap">{artist.profile}</td>
          <td class="px-6 py-4 whitespace-nowrap"><img src={artist.image || ''} alt={artist.name} width="50" /></td>
          <td class="px-6 py-4 whitespace-nowrap">
            <a href="/admin/artists/songs/{artist.id}" class="text-blue-600 hover:text-blue-900">Songs</a>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button class="text-indigo-600 hover:text-indigo-900" on:click={() => openModal(artist)}>Edit</button>
            <button class="text-red-600 hover:text-red-900 ml-4" on:click={() => removeArtist(artist.id)}>Delete</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" on:click={() => openModal()}>Add Artist</button>

{#if showModal}
  <div class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form on:submit|preventDefault={saveArtist} class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Artist Form</h3>
              <div class="mt-2">
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" bind:value={currentArtist.name} required class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div class="mt-2">
                <label class="block text-sm font-medium text-gray-700">Profile</label>
                <input type="text" bind:value={currentArtist.profile} required class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div class="mt-2">
                <label class="block text-sm font-medium text-gray-700">Image</label>
                <input type="file" on:change={handleImageChange} class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
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
