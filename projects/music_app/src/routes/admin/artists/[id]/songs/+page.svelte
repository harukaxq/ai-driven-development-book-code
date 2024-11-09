<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { page } from '$app/stores';

    interface Song {
        id: number;
        title: string;
        image: string;
        audio: string;
    }

    let showModal = writable(false);
    let showEditModal = writable(false);
    let newSongName = '';
    let newSongFile: File | null = null;
    let newSongImage: File | null = null;
    let editSongId: number | null = null;
    let editSongName = '';
    let editSongFile: File | null = null;
    let editSongImage: File | null = null;
    let songs = writable<Song[]>([]);

    const fetchSongs = async () => {
        const response = await fetch(`/api/songs?artistId=${$page.params.id}`);
        const data = await response.json();
        songs.set(data);
    };

    onMount(() => {
        fetchSongs();
    });

    const addSong = async () => {
        const formData = new FormData();
        formData.append('title', newSongName);
        if (newSongFile) {
            formData.append('audio', newSongFile);
        }
        if (newSongImage) {
            formData.append('image', newSongImage);
        }

        formData.append('artistId', $page.params.id);
        const response = await fetch('/admin/api/songs', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showModal.set(false);
            newSongName = '';
            newSongFile = null;
            newSongImage = null;
            alert('曲が追加されました');
            fetchSongs();
        } else {
            console.error('Failed to add song');
        }
    };

    const editSong = async () => {
        if (editSongId === null) return;

        const formData = new FormData();
        formData.append('id', editSongId.toString());
        formData.append('title', editSongName);
        if (editSongFile) {
            formData.append('audio', editSongFile);
        }
        if (editSongImage) {
            formData.append('image', editSongImage);
        }

        const response = await fetch('/admin/api/songs', {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            showEditModal.set(false);
            editSongId = null;
            editSongName = '';
            editSongFile = null;
            editSongImage = null;
            alert('曲情報が更新されました');
            fetchSongs();
        } else {
            console.error('Failed to edit song');
        }
    };

    const openEditModal = (song: Song) => {
        editSongId = song.id;
        editSongName = song.title;
        editSongFile = null;
        editSongImage = null;
        showEditModal.set(true);
    };

    const handleFileChange = (e: Event, setFile: (file: File | null) => void) => {
        const target = e.target as HTMLInputElement;
        setFile(target.files?.[0] || null);
    };
</script>

<div class="mx-4 mt-4">
    <button class="bg-blue-500 text-white p-2 rounded float-right mb-4" on:click={() => showModal.set(true)}>新規曲追加</button>

    {#if $showModal}
        <div class="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white p-4 rounded shadow-lg w-1/3">
                <h2 class="text-xl mb-4">新規曲追加</h2>
                <label class="block mb-2">
                    曲名:
                    <input type="text" bind:value={newSongName} class="border p-2 w-full" />
                </label>
                <label class="block mb-2">
                    音声ファイル:
                    <input type="file" accept="audio/*" on:change={(e) => handleFileChange(e, (file) => newSongFile = file)} class="border p-2 w-full" />
                </label>
                <label class="block mb-4">
                    曲画像:
                    <input type="file" accept="image/*" on:change={(e) => handleFileChange(e, (file) => newSongImage = file)} class="border p-2 w-full" />
                </label>
                <div class="flex justify-end">
                    <button class="bg-gray-500 text-white p-2 rounded mr-2" on:click={() => showModal.set(false)}>キャンセル</button>
                    <button class="bg-blue-500 text-white p-2 rounded" on:click={addSong}>追加</button>
                </div>
            </div>
        </div>
    {/if}

    {#if $showEditModal}
        <div class="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white p-4 rounded shadow-lg w-1/3">
                <h2 class="text-xl mb-4">曲情報編集</h2>
                <label class="block mb-2">
                    曲名:
                    <input type="text" bind:value={editSongName} class="border p-2 w-full" />
                </label>
                <label class="block mb-2">
                    音声ファイル:
                    <input type="file" accept="audio/*" on:change={(e) => handleFileChange(e, (file) => editSongFile = file)} class="border p-2 w-full" />
                </label>
                <label class="block mb-4">
                    曲画像:
                    <input type="file" accept="image/*" on:change={(e) => handleFileChange(e, (file) => editSongImage = file)} class="border p-2 w-full" />
                </label>
                <div class="flex justify-end">
                    <button class="bg-gray-500 text-white p-2 rounded mr-2" on:click={() => showEditModal.set(false)}>キャンセル</button>
                    <button class="bg-blue-500 text-white p-2 rounded" on:click={editSong}>保存</button>
                </div>
            </div>
        </div>
    {/if}

    <table class="min-w-full bg-white mt-4">
        <thead>
            <tr>
                <th class="py-2 px-4 border-b">曲名</th>
                <th class="py-2 px-4 border-b">アートワーク</th>
                <th class="py-2 px-4 border-b">再生プレビュー</th>
                <th class="py-2 px-4 border-b">編集</th>
            </tr>
        </thead>
        <tbody>
            {#each $songs as song}
                <tr>
                    <td class="py-2 px-4 border-b">{song.title}</td>
                    <td class="py-2 px-4 border-b">
                        <div class="flex justify-center">
                            <img src={song.image || '/img/song_default.webp'} alt={song.title} class="h-16 w-16 object-cover rounded-full" />
                        </div>
                    </td>
                    <td class="py-2 px-4 border-b">
                        <div class="flex justify-center">
                            <audio controls>
                                <source src={song.audio} type="audio/mpeg" />
                                お使いのブラウザはオーディオタグをサポートしていません。
                            </audio>
                        </div>
                    </td>
                    <td class="py-2 px-4 border-b text-center">
                        <button class="bg-yellow-500 text-white p-2 rounded" on:click={() => openEditModal(song)}>編集</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
