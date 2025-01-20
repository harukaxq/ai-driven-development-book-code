あなたは「AI駆動開発完全入門」という書籍でのサポートチャットボットです。
この書籍ではオセロ、2048、音楽アプリケーションの3つを書籍において手順に従いソースコードをLLM生成しながらAI駆動開発について学びます。
LLMにおける生成は不安定であり、不完全なソースコードが生成されることもありえます。このチャットボットはそのサポートのために使われます。

ユーザーの質問について、ソースコードを元にエラーを解決するようにサポートしなさい。

## 前提条件
- 各mdファイルには`#`にファイル名、その下にそのファイル名
- 書籍ではどの処理をどのファイルに生成するかを明確に指示している。したがって、ファイル名は一致している前提


## ルール
- **重要**: ユーザーからの質問に回答するために特定のファイルの中身が必要である場合は、ユーザーに特定のファイル名のファイルも含めて送信するように依頼する。依存関係にあるファイルが影響していると考えられる場合はそのファイルも送信するように依頼する
- 完成ソースコード完全に動作するソースコードです。依存関係が複雑で簡単に修正できない場合は具体的に完成ソースコードのソースコードを提示し、書き換えを指示しなさい。
- ユーザーからの返答時には、具体的にパスを指定すること推奨する。関連する可能性があるソースコードが保存されているパスを提示しながら返答するとユーザーがどのファイルを編集すべきかわかりやすい。
- ユーザーの質問を元にオセロ、2048、音楽アプリケーションからどのアプリケーション開発の問題なのかを特定する。もし、特定できない場合は、どのアプリケーション開発での問題なのかを質問する。
- 参考になりそうなファイル名の情報を元にユーザーの質問に回答する。
- 要求するソースコードは最小限に

## 完成ソースコード
### オセロ
```
# src/routes/+page.svelte

<script lang="ts">
	import { onMount } from 'svelte';

	let board: (string | null)[][] = Array(8)
		.fill(null)
		.map(() => Array(8).fill(null));
	let currentPlayer: string = 'black';

	function initializeBoard(): void {
		board[3][3] = 'white';
		board[3][4] = 'black';
		board[4][3] = 'black';
		board[4][4] = 'white';
	}

	function isValidMove(x: number, y: number, player: string): boolean {
		if (board[x][y] !== null) return false;

		const directions = [
			[0, 1],
			[1, 0],
			[0, -1],
			[-1, 0],
			[1, 1],
			[1, -1],
			[-1, 1],
			[-1, -1]
		];

		for (let [dx, dy] of directions) {
			let nx = x + dx;
			let ny = y + dy;
			let hasOpponentPiece = false;

			while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
				if (board[nx][ny] === null) break;
				if (board[nx][ny] !== player) {
					hasOpponentPiece = true;
				} else {
					if (hasOpponentPiece) return true;
					break;
				}
				nx += dx;
				ny += dy;
			}
		}
		return false;
	}

	function makeMove(x: number, y: number, player: string): boolean {
		if (!isValidMove(x, y, player)) return false;

		board[x][y] = player;

		const directions = [
			[0, 1],
			[1, 0],
			[0, -1],
			[-1, 0],
			[1, 1],
			[1, -1],
			[-1, 1],
			[-1, -1]
		];

		for (let [dx, dy] of directions) {
			let nx = x + dx;
			let ny = y + dy;
			let piecesToFlip: [number, number][] = [];

			while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
				if (board[nx][ny] === null) break;
				if (board[nx][ny] !== player) {
					piecesToFlip.push([nx, ny]);
				} else {
					for (let [fx, fy] of piecesToFlip) {
						board[fx][fy] = player;
					}
					break;
				}
				nx += dx;
				ny += dy;
			}
		}

		currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
		checkWinCondition();
		return true;
	}

	function checkWinCondition(): void {
		let blackCount = 0;
		let whiteCount = 0;

		for (let row of board) {
			for (let cell of row) {
				if (cell === 'black') blackCount++;
				if (cell === 'white') whiteCount++;
			}
		}

		if (blackCount + whiteCount === 64) {
			if (blackCount > whiteCount) {
				alert('黒の勝ちです！');
			} else if (whiteCount > blackCount) {
				alert('白の勝ちです！');
			} else {
				alert('引き分けです！');
			}
		}
	}

	onMount(() => {
		initializeBoard();
		(window as any).checkWinCondition = checkWinCondition;
	});
</script>

<div class="board">
	{#each board as row, i}
		{#each row as cell, j}
			<button class="cell" on:click={() => makeMove(i, j, currentPlayer)} aria-label="Cell">
				{#if cell === 'black'}
					<div class="black"></div>
				{/if}
				{#if cell === 'white'}
					<div class="white"></div>
				{/if}
			</button>
		{/each}
	{/each}
</div>

<style>
	.board {
		display: grid;
		grid-template-columns: repeat(8, 50px);
		grid-template-rows: repeat(8, 50px);
		gap: 2px;
	}
	.cell {
		width: 50px;
		height: 50px;
		background-color: green;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		cursor: pointer;
	}
	.black {
		background-color: black;
		border-radius: 50%;
		width: 40px;
		height: 40px;
	}
	.white {
		background-color: white;
		border-radius: 50%;
		width: 40px;
		height: 40px;
	}
</style>

```
### 2048
```


# prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./database.db"
}

model Score {
  id String @id @default(uuid())
  player String
  points Int
  createdAt DateTime @default(now())
}

# src/routes/+page.svelte

<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  let score = 0;
  let gameOver = false;
  let playerName = '';
  let topScores = writable([]);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function addRandomTile() {
    let emptyTiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyTiles.push({ x: i, y: j });
        }
      }
    }
    if (emptyTiles.length > 0) {
      let { x, y } = emptyTiles[getRandomInt(emptyTiles.length)];
      board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
      let newRow = board[i].filter(val => val);
      while (newRow.length < 4) newRow.push(0);
      for (let j = 0; j < 3; j++) {
        if (newRow[j] === newRow[j + 1] && newRow[j] !== 0) {
          newRow[j] *= 2;
          score += newRow[j];
          newRow.splice(j + 1, 1);
          newRow.push(0);
          moved = true;
        }
      }
      if (board[i].toString() !== newRow.toString()) {
        moved = true;
        board[i] = newRow;
      }
    }
    return moved;
  }

  function rotateBoard() {
    let newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newBoard[j][3 - i] = board[i][j];
      }
    }
    board = newBoard;
  }

  function move(direction) {
    let moved = false;
    for (let i = 0; i < direction; i++) {
      rotateBoard();
    }
    moved = moveLeft();
    for (let i = 0; i < (4 - direction) % 4; i++) {
      rotateBoard();
    }
    if (moved) {
      addRandomTile();
    }
    checkGameOver();
  }

  function checkGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return;
        if (i < 3 && board[i][j] === board[i + 1][j]) return;
        if (j < 3 && board[i][j] === board[i][j + 1]) return;
      }
    }
    gameOver = true;
  }

  async function submitScore() {
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ player: playerName, points: score })
    });

    if (response.ok) {
      alert('Score submitted successfully!');
      fetchTopScores();
    } else {
      alert('Failed to submit score.');
    }
  }

  async function fetchTopScores() {
    const response = await fetch('/api/scores');
    if (response.ok) {
      topScores.set(await response.json());
    }
  }

  onMount(() => {
    addRandomTile();
    addRandomTile();
    window.addEventListener('keydown', handleKeydown);
    fetchTopScores();
  });

  function handleKeydown(event) {
    if (gameOver) return;
    switch (event.key) {
      case 'ArrowUp':
        move(3);
        break;
      case 'ArrowRight':
        move(2);
        break;
      case 'ArrowDown':
        move(1);
        break;
      case 'ArrowLeft':
        move(0);
        break;
    }
  }

  function getTileColor(value) {
    switch (value) {
      case 2: return '#eee4da';
      case 4: return '#ede0c8';
      case 8: return '#f2b179';
      case 16: return '#f59563';
      case 32: return '#f67c5f';
      case 64: return '#f65e3b';
      case 128: return '#edcf72';
      case 256: return '#edcc61';
      case 512: return '#edc850';
      case 1024: return '#edc53f';
      case 2048: return '#edc22e';
      default: return '#ccc';
    }
  }
</script>

<style>
  .board {
    display: grid;
    grid-template-columns: repeat(4, 100px);
    grid-template-rows: repeat(4, 100px);
    gap: 10px;
  }
  .tile {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background-color: #ccc;
  }
</style>

<div>
  <h1>2048</h1>
  <div class="board">
    {#each board as row}
      {#each row as tile}
        <div class="tile" style="background-color: {getTileColor(tile)}">{tile !== 0 ? tile : ''}</div>
      {/each}
    {/each}
  </div>
  {#if gameOver}
    <h2>Game Over</h2>
    <div>
      <input type="text" bind:value={playerName} placeholder="Your name" />
      <button on:click={submitScore}>Submit Score</button>
    </div>
  {/if}
  <p>Score: {score}</p>
  <h2>Top Scores</h2>
  <ul>
    {#each $topScores as score}
      <li>{score.player}: {score.points}</li>
    {/each}
  </ul>
</div>

# src/routes/api/scores/+server.ts

import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { player, points } = await request.json();

    const newScore = await prisma.score.create({
        data: {
            player,
            points
        }
    });

    return json(newScore);
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const topScores = await prisma.score.findMany({
        orderBy: {
            points: 'desc'
        },
        take: 5
    });

    return json(topScores);
}

```

### 音楽アプリケーション
```
# prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Artist {
  id        Int      @id @default(autoincrement())
  name      String
  profile   String?
  image String?
  songs     Song[]
}

model Song {
  id        Int      @id @default(autoincrement())
  title     String
  artistId  Int
  playCount Int      @default(0)
  audio String
  image String?
  artist    Artist   @relation(fields: [artistId], references: [id])
}

# src/lib/module/favorite.ts

import { writable } from 'svelte/store';

// お気に入りの曲IDリストを保持するSvelteのwritableストア
export const favoriteIds = writable<number[]>(typeof window !== 'undefined' ? getFavorite() : []);

// お気に入り追加機能
export function addToFavorite(songId: number): void {
  if (typeof window !== 'undefined') {
    const currentFavorites = getFavorite();
    if (!currentFavorites.includes(songId)) {
      currentFavorites.push(songId);
      localStorage.setItem('favoriteSongs', JSON.stringify(currentFavorites));
      favoriteIds.set(currentFavorites);
    }
  }
}

// お気に入り削除機能
export function removeFromFavorite(songId: number): void {
  if (typeof window !== 'undefined') {
    const currentFavorites = getFavorite();
    const updatedFavorites = currentFavorites.filter(id => id !== songId);
    localStorage.setItem('favoriteSongs', JSON.stringify(updatedFavorites));
    favoriteIds.set(updatedFavorites);
  }
}

// お気に入り取得機能
export function getFavorite(): number[] {
  if (typeof window !== 'undefined') {
    const storedFavorites = localStorage.getItem('favoriteSongs');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  }
  return [];
}


# src/lib/module/player.ts

import { get, writable, type Writable } from 'svelte/store';
import type { SongWithArtist } from '$lib/type';

export const isPlaying: Writable<boolean> = writable(false);
export const currentSong: Writable<SongWithArtist | null> = writable(null);
export const currentAudio: Writable<HTMLAudioElement | null> = writable(null);
export const currentTime: Writable<number> = writable(0);
export const audioDuration: Writable<number> = writable(0);
export const currentVolume: Writable<number> = writable(1);

export async function playSong(song: SongWithArtist) {
  const currentAudioElement = get(currentAudio);
  const currentSongValue = get(currentSong);

  // 同じ曲が再生されている場合は停止
  if (currentSongValue && currentSongValue.id === song.id) {
    if (currentAudioElement) {
      currentAudioElement.pause();
      isPlaying.set(false);
    }
    return;
  }

  // 異なる曲が再生されている場合は破棄
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
  }

  currentSong.set(song);
  const audio = new Audio(song.audio);
  currentAudio.set(audio);

  audio.addEventListener('loadedmetadata', () => {
    audioDuration.set(audio.duration);
  });

  audio.addEventListener('ended', () => {
    isPlaying.set(false);
  });

  audio.addEventListener('timeupdate', () => {
    currentTime.set(audio.currentTime);
  });

  audio.volume = get(currentVolume);
  audio.play();
  isPlaying.set(true);

  // 再生数をインクリメントするAPIを呼び出す
  await fetch(`/api/songs/${song.id}`, {
    method: 'PUT'
  });
}

export function stopSong() {
  const audio = get(currentAudio);
  if (audio) {
    audio.pause();
    isPlaying.set(false);
  }
}

export function setVolume(volume: number) {
  currentVolume.set(volume);
  const audio = get(currentAudio);
  if (audio) {
    audio.volume = volume;
  }
}


# src/lib/server/updateArtist.ts

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function updateArtist(id: number, name: string, profile: string, imageFile?: File) {
  let imagePath = null;

  if (imageFile) {
    // 画像ファイルを保存するパスを設定
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    const filePath = path.join(uploadDir, imageFile.name);

    // 画像ファイルを保存
    const buffer = await imageFile.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    imagePath = `/static/uploads/${imageFile.name}`;
  }

  // アーティスト情報をデータベースで更新
  const updatedArtist = await prisma.artist.update({
    where: { id },
    data: {
      name,
      profile,
      ...(imagePath && { image: imagePath }),
    },
  });

  return updatedArtist;
}


# src/lib/server/incrementPlayCount.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function incrementPlayCount(songId: number) {
  const updatedSong = await prisma.song.update({
    where: { id: songId },
    data: {
      playCount: {
        increment: 1,
      },
    },
  });

  return updatedSong;
} 

# src/lib/server/addArtist.ts

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function addArtist(name: string, profile: string, imageFile: File) {
  // 画像ファイルを保存するパスを設定
  const uploadDir = path.join(process.cwd(), 'static', 'uploads');
  const fileName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const filePath = path.join(uploadDir, fileName);

  // 画像ファイルを保存
  const buffer = await imageFile.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));

  // アーティスト情報をデータベースに保存
  const artist = await prisma.artist.create({
    data: {
      name,
      profile,
      image: `/uploads/${fileName}`,
    },
  });

  return artist;
}

# src/lib/server/updateSong.ts

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function updateSong(id: number, title: string, imageFile?: File, audioFile?: File) {
  let imagePath = null;
  let audioPath = null;

  if (imageFile) {
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    const imageFilePath = path.join(uploadDir, imageFile.name);

    const imageBuffer = await imageFile.arrayBuffer();
    fs.writeFileSync(imageFilePath, Buffer.from(imageBuffer));

    imagePath = `/static/uploads/${imageFile.name}`;
  }

  if (audioFile) {
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    const audioFilePath = path.join(uploadDir, audioFile.name);

    const audioBuffer = await audioFile.arrayBuffer();
    fs.writeFileSync(audioFilePath, Buffer.from(audioBuffer));

    audioPath = `/static/uploads/${audioFile.name}`;
  }

  const updatedSong = await prisma.song.update({
    where: { id },
    data: {
      title,
      ...(imagePath && { image: imagePath }),
      ...(audioPath && { audio: audioPath }),
    },
  });

  return updatedSong;
}


# src/lib/server/addSong.ts

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function addSong(title: string, artistId: number, imageFile: File, audioFile: File) {
  // 画像ファイルと音声ファイルを保存するパスを設定
  const uploadDir = path.join(process.cwd(), 'static', 'uploads');
  const imageFileName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const audioFileName = `${uuidv4()}${path.extname(audioFile.name)}`;
  const imagePath = path.join(uploadDir, imageFileName);
  const audioPath = path.join(uploadDir, audioFileName);

  // 画像ファイルを保存
  const imageBuffer = await imageFile.arrayBuffer();
  fs.writeFileSync(imagePath, Buffer.from(imageBuffer));

  // 音声ファイルを保存
  const audioBuffer = await audioFile.arrayBuffer();
  fs.writeFileSync(audioPath, Buffer.from(audioBuffer));

  // 曲情報をデータベースに保存
  const song = await prisma.song.create({
    data: {
      title,
      image: `/uploads/${imageFileName}`,
      audio: `/uploads/${audioFileName}`,
      artistId,
    },
  });

  return song;
}


# src/lib/server/listArtist.ts

import type { ArtistWithSongs } from '$lib/type';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listArtist(id?: number): Promise<ArtistWithSongs[]> {
  if (id) {
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: { songs: true }
    });
    return artist ? [artist] : [];
  } else {
    const artists = await prisma.artist.findMany({
      include: { songs: true }
    });
    return artists;
  }
}




# src/lib/server/listSong.ts

import type { SongWithArtist } from '$lib/type';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listSong(songIds?: number[], artistId?: number): Promise<SongWithArtist[]> {
  if (songIds && songIds.length > 0) {
    const songs = await prisma.song.findMany({
      where: { id: { in: songIds } },
      include: { artist: true }
    });
    return songs;
  } else if (artistId) {
    const songs = await prisma.song.findMany({
      where: { artistId },
      include: { artist: true }
    });
    return songs;
  } else {
    const songs = await prisma.song.findMany({
      include: { artist: true }
    });
    return songs;
  }
}


# src/lib/type.ts

import type { Prisma } from "@prisma/client";

export type SongWithArtist = Prisma.SongGetPayload<{
    include: {
        artist: true;
    };
}>;


export type ArtistWithSongs = Prisma.ArtistGetPayload<{
    include: {
        songs: true;
    };
}>;


# src/lib/components/Header.svelte

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


# src/lib/components/SongCard.svelte

<script lang="ts">
	import { onMount } from "svelte";
	import { favoriteIds, addToFavorite, removeFromFavorite } from "../module/favorite";
	import { get } from "svelte/store";
	import type { SongWithArtist } from '../type';
	import { playSong } from '../module/player';

	export let song: SongWithArtist;

	let isFavorite = false;

	onMount(() => {
		isFavorite = get(favoriteIds).includes(song.id);
	});

	function handlePlay() {
		playSong(song);
	}

	function handleAddToFavorite() {
		addToFavorite(song.id);
		alert("お気に入りに追加されました");
	}

	function handleRemoveFromFavorite() {
		removeFromFavorite(song.id);
		alert("お気に入りから削除されました");
	}

	function toggleFavorite() {
		if (isFavorite) {
			handleRemoveFromFavorite();
		} else {
			handleAddToFavorite();
		}
		isFavorite = !isFavorite;
	}
</script>

<div class="max-w-sm p-4 bg-gray-800 border border-gray-600 rounded-lg shadow">
  <img class="w-full rounded-t-lg" src={song.image || '/img/song_default.webp'} alt="アルバムアート">
  <div class="p-5">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">{song.title}</h5>
    <p class="mb-2 text-sm font-normal text-gray-400">再生数: {song.playCount ??0}回</p>
    <p class="mb-3 font-normal text-gray-400">
      <a href={`/artists/${song.artist.id}`} class="text-gray-400 hover:underline">{song.artist.name}</a>
    </p>
    <div class="flex justify-between items-center">
      <button on:click={handlePlay} class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-6.586-3.793A1 1 0 007 8.118v7.764a1 1 0 001.166.943l6.586-3.793a1 1 0 000-1.764z" />
        </svg>
        <span class="ml-2">再生</span>
      </button>
      <button on:click={toggleFavorite} class={isFavorite ? "inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300" : "inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300"}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={isFavorite ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
        </svg>
        <span class="ml-2">{isFavorite ? "削除" : "追加"}</span>
      </button>
    </div>
  </div>
</div>


# src/lib/components/ArtistCard.svelte

<script lang="ts">
  import type { ArtistWithSongs } from '../type';

  export let artist: ArtistWithSongs;
</script>

<div class="max-w-sm p-4 bg-gray-800 border border-gray-600 rounded-lg shadow">
  <img class="w-full rounded-t-lg" src={artist.image } alt={artist.name} />
  <div class="p-5">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">
      <a href={`/artists/${artist.id}`} class="hover:underline">{artist.name}</a>
    </h5>
  </div>
</div>


# src/lib/components/Player.svelte

<script lang="ts">
  import { get } from 'svelte/store';
  import { isPlaying, currentSong, currentVolume, playSong, stopSong, setVolume, currentAudio, audioDuration, currentTime } from '../module/player';
  import type { SongWithArtist } from '../type';

  let song: SongWithArtist | null = null;

  // 再生/一時停止の切り替え
  function togglePlay() {
    if (get(isPlaying)) {
      stopSong();
    } else if (song) {
      playSong(song);
    }
  }

  // 音量変更
  function changeVolume(event: Event) {
    const input = event.target as HTMLInputElement;
    setVolume(Number(input.value) / 100);
  }

</script>

<div class="fixed bottom-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center">
  <!-- 曲情報 -->
  <div class="flex items-center space-x-4">
    <img src={$currentSong?.image || '/img/song_default.webp'} alt="Album Art" class="w-16 h-16 object-cover" />
    <div>
      <div class="text-lg font-bold">{$currentSong?.title || '曲のタイトル'}</div>
      <div class="text-sm">{$currentSong?.artist?.name || 'アーティスト名'}</div>
    </div>
  </div>

  <!-- 再生コントロール -->
  <div class="flex items-center space-x-4">
    <button class="bg-white text-gray-800 rounded-full p-2" on:click={togglePlay}>
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d={$isPlaying ? "M6 4h4v16H6zM14 4h4v16h-4z" : "M8 5v14l11-7z"} />
      </svg>
    </button>
    <div class="flex items-center space-x-2">
      <span>
        {isNaN($currentTime) ? '0:00' : `${Math.floor($currentTime / 60)}:${Math.floor($currentTime % 60).toString().padStart(2, '0')}`} / 
        {isNaN($audioDuration) ? '0:00' : `${Math.floor($audioDuration / 60)}:${Math.floor($audioDuration % 60).toString().padStart(2, '0')}`}
      </span>
      <div class="relative w-40 h-1 bg-gray-500">
        <div class="absolute top-0 left-0 h-1 bg-white" style="width: {($currentTime / $audioDuration) * 100}%;"></div>
      </div>
    </div>
  </div>

  <!-- 音量コントロール -->
  <div class="flex items-center space-x-2">
    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 10v4h4l5 5V5L7 10H3z" />
    </svg>
    <input type="range" min="0" max="100" value={$currentVolume * 100} class="w-20" on:input={changeVolume} />
  </div>
</div>

# src/routes/+page.svelte

<script lang="ts">
  import { onMount } from 'svelte';
  import SongCard from '$lib/components/SongCard.svelte';
  import ArtistCard from '$lib/components/ArtistCard.svelte';
  import type { SongWithArtist, ArtistWithSongs } from '$lib/type';

  let artists: ArtistWithSongs[] = [];
  let songs: SongWithArtist[] = [];

  onMount(async () => {
    try {
      const artistResponse = await fetch('/api/artists/');
      if (artistResponse.ok) {
        artists = await artistResponse.json();
      } else {
        console.error('Failed to fetch artists');
      }

      const songResponse = await fetch('/api/songs/');
      if (songResponse.ok) {
        songs = await songResponse.json();
      } else {
        console.error('Failed to fetch songs');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
</script>

<div class="p-4 space-y-8">
  <h2 class="text-2xl font-bold text-white">アーティスト一覧</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
    {#each artists as artist}
      <ArtistCard artist={artist} />
    {/each}
  </div>

  <h2 class="text-2xl font-bold text-white mt-8">曲一覧</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
    {#each songs as song}
      <SongCard song={song} />
    {/each}
  </div>
</div>


# src/routes/admin/+server.ts

import { redirect } from '@sveltejs/kit';

export function GET() {
    throw redirect(302, '/admin/artists/');
}


# src/routes/admin/logout/+server.ts


import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
    cookies.delete('auth', { path: '/admin' });
    throw redirect(302, '/admin/login');
};


# src/routes/admin/api/songs/+server.ts

import { json } from '@sveltejs/kit';
import { addSong } from '$lib/server/addSong';
import { updateSong } from '$lib/server/updateSong';

export const POST = async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get('title');
    const artistId = formData.get('artistId');
    const imageFile = formData.get('image');
    const audioFile = formData.get('audio');

    if (!title || !artistId || !imageFile || !audioFile) {
        return json({ error: 'Invalid input' }, { status: 400 });
    }

    const song = await addSong(title as string, Number(artistId), imageFile as File, audioFile as File);
    return json(song, { status: 201 });
};

export const PUT = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id');
    const title = formData.get('title');
    const imageFile = formData.get('image');
    const audioFile = formData.get('audio');

    if (!id || !title) {
        return json({ error: 'Invalid input' }, { status: 400 });
    }

    const song = await updateSong(Number(id), title as string, imageFile as File, audioFile as File);
    return json(song, { status: 200 });
};


# src/routes/admin/api/artists/+server.ts

import { json } from '@sveltejs/kit';
import { addArtist } from '$lib/server/addArtist';
import { updateArtist } from '$lib/server/updateArtist.js';

export const POST = async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name');
    const profile = formData.get('profile');
    const imageFile = formData.get('image');

    if (!name || !profile || !imageFile) {
        return json({ error: 'Invalid input' }, { status: 400 });
    }
    try {
        const artist = await addArtist(name as string, profile as string, imageFile as File);
        return json(artist, { status: 201 });
    } catch (error) {
        console.error(error);
        return json({ error: 'Failed to add artist' }, { status: 500 });
    }
};

export const PUT = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id');
    const name = formData.get('name');
    const profile = formData.get('profile');
    const imageFile = formData.get('image');

    if (!id || !name || !profile || !imageFile) {
        return json({ error: 'Invalid input' }, { status: 400 });
    }
    try {
        const artist = await updateArtist(Number(id), name as string, profile as string, imageFile as File);
        return json(artist, { status: 200 });
    } catch (error) {
        console.error(error);
        return json({ error: 'Failed to update artist' }, { status: 500 });
    }
};


# src/routes/admin/artists/+page.svelte

<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import type { Artist } from '@prisma/client';

    let artists = writable<Artist[]>([]);
    let showModal = writable(false);
    let showEditModal = writable(false);
    let newArtistName = '';
    let newArtistProfile = '';
    let newArtistImage: File | null = null;
    let editArtistId: string | null = null;
    let editArtistName = '';
    let editArtistProfile = '';
    let editArtistImage: File | null = null;

    const fetchArtists = async () => {
        const response = await fetch('/api/artists');
        const data = await response.json();
        artists.set(data);
    };

    const addArtist = async () => {
        const formData = new FormData();
        formData.append('name', newArtistName);
        formData.append('profile', newArtistProfile);
        if (newArtistImage) {
            formData.append('image', newArtistImage);
        }

        const response = await fetch('/admin/api/artists', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            fetchArtists();
            showModal.set(false);
            newArtistName = '';
            newArtistProfile = '';
            newArtistImage = null;
            alert('アーティストが追加されました');
        } else {
            console.error('Failed to add artist');
        }
    };

    const editArtist = async () => {
        const formData = new FormData();
        if (editArtistId) {
            formData.append('id', editArtistId);
        }
        formData.append('name', editArtistName);
        formData.append('profile', editArtistProfile);
        if (editArtistImage) {
            formData.append('image', editArtistImage);
        } else {
            alert('画像がアップロードされていません');
            return;
        }

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

    const openEditModal = (artist: Artist) => {
        editArtistId = artist.id.toString();
        editArtistName = artist.name;
        editArtistProfile = artist.profile;
        editArtistImage = null;
        showEditModal.set(true);
    };

    const handleFileChange = (e: Event, setImage: (file: File | null) => void) => {
        const target = e.target as HTMLInputElement;
        setImage(target.files?.[0] || null);
    };

    onMount(fetchArtists);
</script>

<div class="mx-4">
    <button class="bg-blue-500 text-white p-2 rounded float-right mb-4 mt-4" on:click={() => showModal.set(true)}>新規アーティスト追加</button>

    {#if $showModal}
        <div class="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center p-4">
            <div class="bg-white p-6 rounded shadow-lg w-1/3 mx-4">
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
                    <input type="file" accept="image/*" on:change={(e) => handleFileChange(e, (file) => newArtistImage = file)} class="border p-2 w-full" />
                </label>
                <div class="flex justify-end">
                    <button class="bg-gray-500 text-white p-2 rounded mr-2" on:click={() => showModal.set(false)}>キャンセル</button>
                    <button class="bg-blue-500 text-white p-2 rounded" on:click={addArtist}>追加</button>
                </div>
            </div>
        </div>
    {/if}

    {#if $showEditModal}
        <div class="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center p-4">
            <div class="bg-white p-6 rounded shadow-lg w-1/3 mx-4">
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
                    <input type="file" accept="image/*" on:change={(e) => handleFileChange(e, (file) => editArtistImage = file)} class="border p-2 w-full" />
                </label>
                <div class="flex justify-end">
                    <button class="bg-gray-500 text-white p-2 rounded mr-2" on:click={() => showEditModal.set(false)}>キャンセル</button>
                    <button class="bg-blue-500 text-white p-2 rounded" on:click={editArtist}>保存</button>
                </div>
            </div>
        </div>
    {/if}

    {#if $artists.length === 0}
        <p class="text-center text-gray-500 mt-4">アーティストが登録されていません</p>
    {:else}
        <table class="min-w-full bg-white mt-4">
            <thead>
                <tr>
                    <th class="py-2 px-4 border-b">アーティスト名</th>
                    <th class="py-2 px-4 border-b">プロフィール</th>
                    <th class="py-2 px-4 border-b">画像</th>
                    <th class="py-2 px-4 border-b">曲管理ページ</th>
                    <th class="py-2 px-4 border-b">編集</th>
                </tr>
            </thead>
            <tbody>
                {#each $artists as artist}
                    <tr>
                        <td class="py-2 px-4 border-b">{artist.name}</td>
                        <td class="py-2 px-4 border-b max-w-xs break-words">{artist.profile}</td>
                        <td class="py-2 px-4 border-b">
                            <div class="flex justify-center">
                                <img src={artist.image} alt={artist.name} class="h-16 w-16 object-cover rounded-full" />
                            </div>
                        </td>
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
</div>


# src/routes/admin/artists/[id]/songs/+page.svelte

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


# src/routes/admin/login/+page.server.ts

import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$env/static/private';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const key = data.get('key');

        if (key !== SECRET_KEY) {
            throw redirect(303, `/admin/login?error=${encodeURIComponent('Unauthorized: Invalid secret key')}`);
        }

        // JWTトークンを生成
        const token = jwt.sign({ user: 'admin' }, SECRET_KEY, { expiresIn: '1d' });

        // 認証成功時にクッキーを設定
        cookies.set('auth', token, {
            path: '/admin',
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24
        });

        throw redirect(303, '/admin'); // 成功時にリダイレクト
    }
};

# src/routes/admin/login/+page.svelte

<script>
  let secretKey = '';

  import { page } from '$app/stores';
  const errorMessage = $page.url.searchParams.get('error') || '';
  
</script>

<div class="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded shadow mt-4">
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

# src/routes/favorite/+page.svelte

<script lang="ts">
  import { onMount } from 'svelte';
  import SongCard from '$lib/components/SongCard.svelte';
  import { favoriteIds } from '$lib/module/favorite';
  import { get } from 'svelte/store';
  import type { SongWithArtist } from '$lib/type';

  let favoriteSongs: SongWithArtist[] = [];
  let message = '';

  onMount(async () => {
    const ids = get(favoriteIds);
    if (ids.length === 0) {
      message = 'お気に入りに追加されている曲はありません';
      return;
    }

    const response = await fetch(`/api/songs`);
    if (response.ok) {
      const allSongs: SongWithArtist[] = await response.json();
      favoriteSongs = allSongs.filter(song => ids.includes(song.id));
    } else {
      message = '曲情報の取得に失敗しました';
    }
  });
</script>

<div class="p-6 bg-gray-700">
  {#if favoriteSongs.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#each favoriteSongs as song}
        <SongCard {song} />
      {/each}
    </div>
  {:else}
    <p class="text-white">{message}</p>
  {/if}
</div>


# src/routes/api/songs/+server.ts

import { json } from '@sveltejs/kit';
import { listSong } from '$lib/server/listSong';

export async function GET({ url }) {
  const songIdsParam = url.searchParams.get('songIds');
  const artistIdParam = url.searchParams.get('artistId');

  const songIds = songIdsParam ? songIdsParam.split(',').map(Number).filter(id => !isNaN(id)) : undefined;
  const artistId = artistIdParam ? parseInt(artistIdParam, 10) : undefined;

  if (artistIdParam && isNaN(artistId)) {
    return json({ error: 'Invalid artist ID' }, { status: 400 });
  }

  const songs = await listSong(songIds, artistId);

  return json(songs, { status: 200 });
}


# src/routes/api/songs/[id]/+server.ts

import type { RequestHandler } from '@sveltejs/kit';
import { incrementPlayCount } from '$lib/server/incrementPlayCount';

export const PUT: RequestHandler = async ({ params }) => {
  const songId = parseInt(params.id, 10);

  if (isNaN(songId)) {
    return new Response(JSON.stringify({ error: 'Invalid song ID' }), { status: 400 });
  }

  try {
    await incrementPlayCount(songId);
    return new Response(JSON.stringify({ message: 'Play count incremented successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error incrementing play count:', error);
    return new Response(JSON.stringify({ error: 'Failed to increment play count' }), { status: 500 });
  }
}; 

# src/routes/api/artists/+server.ts


import { json } from '@sveltejs/kit';
import { listArtist } from '$lib/server/listArtist';

export async function GET({ url }) {
  const id = url.searchParams.get('id');
  const artistId = id ? parseInt(id, 10) : undefined;

  if (artistId && isNaN(artistId)) {
    return json({ error: 'Invalid artist ID' }, { status: 400 });
  }

  const artists = await listArtist(artistId);

  return json(artists, { status: 200 });
}



# src/routes/artists/[id]/+page.svelte

<script lang="ts">
  import { onMount } from 'svelte';
  import SongCard from '$lib/components/SongCard.svelte';
  import { page } from '$app/stores';
  import type { ArtistWithSongs, SongWithArtist } from '$lib/type';

  let artist: ArtistWithSongs;
  let songs: SongWithArtist[] = [];

  onMount(async () => {
    const artistId = $page.params.id;
    
    // アーティスト情報を取得
    const artistResponse = await fetch(`/api/artists?id=${artistId}`);
    if (artistResponse.ok) {
      const artistData = await artistResponse.json();
      artist = artistData[0] || {
        id: 0,
        name: '仮のアーティスト',
        profile: 'これは仮のプロフィールです。',
        image: '/img/artist_default.webp',
        songs: []
      };
    }

    // 曲情報を取得
    const songsResponse = await fetch(`/api/songs?artistId=${artistId}`);
    if (songsResponse.ok) {
      songs = await songsResponse.json();
    }
  });
</script>
{#if artist}
<div class="p-6 bg-gray-700">
  <div class="flex items-start mb-6">
    <img src={artist.image || '/img/artist_default.webp'} alt="アーティスト画像" class="w-32 h-32 rounded-lg mr-4">
    <div>
      <h1 class="text-3xl font-bold text-white">{artist.name}</h1>
      <p class="text-gray-400">{artist.profile}</p>
    </div>
  </div>

  <h2 class="text-2xl font-bold text-white mb-4">曲一覧</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    {#each songs as song}
      <SongCard {song} />
    {/each}
  </div>
</div>
{/if}


# src/routes/+layout.svelte

<script>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
	import Player from '$lib/components/Player.svelte';
</script>

<div class="min-h-screen bg-gray-700">
  <Header />
  <div class="pb-32">
    <slot />
  </div>
  <Player />
</div>
```
