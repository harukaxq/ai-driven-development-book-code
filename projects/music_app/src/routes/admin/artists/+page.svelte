<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const artists = writable([]);
  const newArtist = {
    name: '',
    profile: '',
    image: ''
  };
  let isModalOpen = false;
  let editingArtist = null;

  const fetchArtists = async () => {
    const response = await fetch('/api/artist');
    const data = await response.json();
    artists.set(data);
  };

  const addArtist = async () => {
    const response = await fetch('/api/artist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newArtist)
    });
    if (response.ok) {
      fetchArtists();
      resetNewArtist();
      alert('アーティストが追加されました');
      isModalOpen = false; // モーダルを閉じる
    } else {
      alert('アーティストの追加に失敗しました');
    }
  };

  const updateArtist = async () => {
    const response = await fetch(`/api/artist/${editingArtist.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editingArtist)
    });
    if (response.ok) {
      fetchArtists();
      alert('アーティストが更新されました');
      isModalOpen = false; // モーダルを閉じる
    } else {
      alert('アーティストの更新に失敗しました');
    }
  };

  const deleteArtist = async (id) => {
    const response = await fetch(`/api/artist/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      fetchArtists();
      alert('アーティストが削除されました');
    } else {
      alert('アーティストの削除に失敗しました');
    }
  };

  const resetNewArtist = () => {
    newArtist.name = '';
    newArtist.profile = '';
    newArtist.image = '';
  };

  const openModal = (artist = null) => {
    if (artist) {
      editingArtist = { ...artist }; // 編集するアーティストの情報をコピー
    } else {
      resetNewArtist();
    }
    isModalOpen = true; // モーダルを開く
  };

  onMount(() => {
    fetchArtists();
  });
</script>

vasdfbbgb
<div>
  <h1>アーティスト管理</h1>
  <table>
    <thead>
      <tr>
        <th>アーティスト名</th>
        <th>プロフィール</th>
        <th>画像</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      {#each $artists as artist}
        <tr>
          <td>{artist.name}</td>
          <td>{artist.profile}</td>
          <td><img src={artist.image} alt={artist.name} width="50" /></td>
          <td>
            <button on:click={() => openModal(artist)}>編集</button>
            <button on:click={() => deleteArtist(artist.id)}>削除</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2>新規アーティスト追加</h2>
  <button on:click={() => openModal()}>アーティスト追加</button>

  {#if isModalOpen}
    <div class="modal">
      <h2>{editingArtist ? 'アーティスト編集' : '新規アーティスト追加'}</h2>
      <input type="text" placeholder="アーティスト名" bind:value={editingArtist ? editingArtist.name : newArtist.name} />
      <textarea placeholder="プロフィール" bind:value={editingArtist ? editingArtist.profile : newArtist.profile}></textarea>
      <input type="file" bind:value={editingArtist ? editingArtist.image : newArtist.image} />
      <button on:click={editingArtist ? updateArtist : addArtist}>{editingArtist ? '更新' : '追加'}</button>
      <button on:click={() => isModalOpen = false}>キャンセル</button>
    </div>
  {/if}
</div>