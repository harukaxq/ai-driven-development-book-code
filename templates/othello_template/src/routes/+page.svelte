<script>
  import { onMount } from 'svelte';

  let board = [];
  let currentPlayer = 'black';
  let gameOver = false;

  function initializeBoard() {
    board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[3][3] = 'white';
    board[3][4] = 'black';
    board[4][3] = 'black';
    board[4][4] = 'white';
  }

  function isValidMove(x, y, player) {
    if (board[x][y] !== null) return false;
    const directions = [
      [0, 1], [1, 0], [0, -1], [-1, 0],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];
    for (const [dx, dy] of directions) {
      let nx = x + dx;
      let ny = y + dy;
      let hasOpponentDisk = false;
      while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
        if (board[nx][ny] === null) break;
        if (board[nx][ny] !== player) {
          hasOpponentDisk = true;
        } else {
          if (hasOpponentDisk) return true;
          break;
        }
        nx += dx;
        ny += dy;
      }
    }
    return false;
  }

  function makeMove(x, y) {
    if (!isValidMove(x, y, currentPlayer)) return;
    board[x][y] = currentPlayer;
    flipDisks(x, y, currentPlayer);
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    if (!hasValidMove(currentPlayer)) {
      currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
      if (!hasValidMove(currentPlayer)) {
        gameOver = true;
      }
    }
  }

  function flipDisks(x, y, player) {
    const directions = [
      [0, 1], [1, 0], [0, -1], [-1, 0],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];
    for (const [dx, dy] of directions) {
      let nx = x + dx;
      let ny = y + dy;
      let disksToFlip = [];
      while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
        if (board[nx][ny] === null) break;
        if (board[nx][ny] !== player) {
          disksToFlip.push([nx, ny]);
        } else {
          for (const [fx, fy] of disksToFlip) {
            board[fx][fy] = player;
          }
          break;
        }
        nx += dx;
        ny += dy;
      }
    }
  }

  function hasValidMove(player) {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (isValidMove(x, y, player)) return true;
      }
    }
    return false;
  }

  function countDisks() {
    let blackCount = 0;
    let whiteCount = 0;
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (board[x][y] === 'black') blackCount++;
        if (board[x][y] === 'white') whiteCount++;
      }
    }
    return { black: blackCount, white: whiteCount };
  }

  onMount(() => {
    initializeBoard();
  });
</script>

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
  }
  .disk {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .black {
    background-color: black;
  }
  .white {
    background-color: white;
  }
</style>

<div class="board">
  {#each board as row, x}
    {#each row as cell, y}
      <div class="cell" on:click={() => makeMove(x, y)}>
        {#if cell}
          <div class="disk {cell}"></div>
        {/if}
      </div>
    {/each}
  {/each}
</div>

{#if gameOver}
  <div>
    <p>ゲーム終了</p>
    {#await Promise.resolve(countDisks()) then { black, white }}
      <p>黒: {black} 白: {white}</p>
      <p>{black > white ? '黒の勝ち' : white > black ? '白の勝ち' : '引き分け'}</p>
    {/await}
  </div>
{/if}
