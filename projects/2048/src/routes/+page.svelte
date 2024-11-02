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