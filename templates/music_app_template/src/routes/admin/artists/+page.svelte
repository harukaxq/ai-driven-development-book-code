<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    let artists = writable([]);
    let showModal = writable(false);
    let showEditModal = writable(false);
    let newArtistName = '';
    let newArtistProfile = '';
    let newArtistImage = null;
    let editArtistId = null;
    let editArtistName = '';
    let editArtistProfile = '';
    let editArtistImage = null;

    const fetchArtists = async () => {
        const response = await fetch('/api/artists');
        const data = await response.json();
        artists.set(data);
    };

    const addArtist = async () => {
        const formData = new FormData();
        formData.append('name', newArtistName);
        formData.append('profile', newArtistProfile);
        formData.append('image', newArtistImage);

        const response = await fetch('/admin/api/artists', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            fetchArtists();
            showModal.set(false);
        } else {
            console.error('Failed to add artist');
        }
    };

    const editArtist = async () => {
        const formData = new FormData();
        formData.append('id', editArtistId);
        formData.append('name', editArtistName);
        formData.append('profile', editArtistProfile);
        formData.append('image', editArtistImage);

        const response = await fetch('/admin/api/artists', {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            fetchArtists();
            showEditModal.set(false);
        } else {
            console.error('Failed to edit artist');
        }
    };

    const openEditModal = (artist) => {
        editArtistId = artist.id;
        editArtistName = artist.name;
        editArtistProfile = artist.profile;
        editArtistImage = null;
        showEditModal.set(true);
    };

    onMount(fetchArtists);
</script>

<button class="bg-blue-500 text-white p-2 rounded float-right mb-4" on:click={() => showModal.set(true)}>新規アーティスト追加</button>

{#if $showModal}
    <div class="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white p-4 rounded shadow-lg w-1/3">
            <h2 class="text-xl mb-4">新規アーティスト追加</h2>
            <label class="block mb-2">
                名前:
                <input type="text" bind:value={newArtistName} class="border p-2 w-full" />
            </label>
            <label class="block mb-2">
                プロフィール:
                <textarea bind:value={newArtistProfile} class="border p-2 w-full"></textarea>
            </label>
            <label class="block mb-4">
                画像:
                <input type="file" accept="image/*" on:change={(e) => newArtistImage = e.target.files[0]} class="border p-2 w-full" />
            </label>
            <div class="flex justify-end">
                <button class="bg-gray-500 text-white p-2 rounded mr-2" on:click={() => showModal.set(false)}>キャンセル</button>
                <button class="bg-blue-500 text-white p-2 rounded" on:click={addArtist}>追加</button>
            </div>
        </div>
    </div>
{/if}

{#if $showEditModal}
    <div class="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white p-4 rounded shadow-lg w-1/3">
            <h2 class="text-xl mb-4">アーティスト情報編集</h2>
            <label class="block mb-2">
                名前:
                <input type="text" bind:value={editArtistName} class="border p-2 w-full" />
            </label>
            <label class="block mb-2">
                プロフィール:
                <textarea bind:value={editArtistProfile} class="border p-2 w-full"></textarea>
            </label>
            <label class="block mb-4">
                画像:
                <input type="file" accept="image/*" on:change={(e) => editArtistImage = e.target.files[0]} class="border p-2 w-full" />
            </label>
            <div class="flex justify-end">
                <button class="bg-gray-500 text-white p-2 rounded mr-2" on:click={() => showEditModal.set(false)}>キャンセル</button>
                <button class="bg-blue-500 text-white p-2 rounded" on:click={editArtist}>保存</button>
            </div>
        </div>
    </div>
{/if}

{#if $artists.length === 0}
    <p class="text-center text-gray-500">アーティストが登録されていません</p>
{:else}
    <table class="min-w-full bg-white">
        <thead>
            <tr>
                <th class="py-2 px-4 border-b">アーティスト名</th>
                <th class="py-2 px-4 border-b">画像</th>
                <th class="py-2 px-4 border-b">作成日時</th>
                <th class="py-2 px-4 border-b">曲管理ページ</th>
                <th class="py-2 px-4 border-b">編集</th>
            </tr>
        </thead>
        <tbody>
            {#each $artists as artist}
                <tr>
                    <td class="py-2 px-4 border-b">{artist.name}</td>
                    <td class="py-2 px-4 border-b">
                        <img src={artist.image} alt={artist.name} class="h-16 w-16 object-cover rounded-full" />
                    </td>
                    <td class="py-2 px-4 border-b">{new Date(artist.createdAt).toLocaleString()}</td>
                    <td class="py-2 px-4 border-b text-center">
                        <a href={`/admin/artists/${artist.id}/songs`} class="text-blue-500 hover:underline">曲管理</a>
                    </td>
                    <td class="py-2 px-4 border-b text-center">
                        <button class="bg-yellow-500 text-white p-2 rounded" on:click={() => openEditModal(artist)}>編集</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}

