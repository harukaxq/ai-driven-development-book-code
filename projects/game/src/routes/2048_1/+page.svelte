<script>
  import { onMount } from 'svelte';

  let board = [];
  let score = 0;
  let gameOver = false;

  function initializeBoard() {
    board = Array(4).fill(null).map(() => Array(4).fill(null));
    addRandomTile();
    addRandomTile();
  }

  function addRandomTile() {
    let emptyCells = [];
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (board[x][y] === null) {
          emptyCells.push({ x, y });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function move(direction) {
    let moved = false;
    if (direction === 'left') {
      for (let x = 0; x < 4; x++) {
        let row = board[x].filter(cell => cell !== null);
        for (let y = 0; y < row.length - 1; y++) {
          if (row[y] === row[y + 1]) {
            row[y] *= 2;
            score += row[y];
            row.splice(y + 1, 1);
          }
        }
        while (row.length < 4) {
          row.push(null);
        }
        if (board[x].toString() !== row.toString()) {
          moved = true;
        }
        board[x] = row;
      }
    } else if (direction === 'right') {
      for (let x = 0; x < 4; x++) {
        let row = board[x].filter(cell => cell !== null);
        for (let y = row.length - 1; y > 0; y--) {
          if (row[y] === row[y - 1]) {
            row[y] *= 2;
            score += row[y];
            row.splice(y - 1, 1);
          }
        }
        while (row.length < 4) {
          row.unshift(null);
        }
        if (board[x].toString() !== row.toString()) {
          moved = true;
        }
        board[x] = row;
      }
    } else if (direction === 'up') {
      for (let y = 0; y < 4; y++) {
        let column = [];
        for (let x = 0; x < 4; x++) {
          if (board[x][y] !== null) {
            column.push(board[x][y]);
          }
        }
        for (let x = 0; x < column.length - 1; x++) {
          if (column[x] === column[x + 1]) {
            column[x] *= 2;
            score += column[x];
            column.splice(x + 1, 1);
          }
        }
        while (column.length < 4) {
          column.push(null);
        }
        for (let x = 0; x < 4; x++) {
          if (board[x][y] !== column[x]) {
            moved = true;
          }
          board[x][y] = column[x];
        }
      }
    } else if (direction === 'down') {
      for (let y = 0; y < 4; y++) {
        let column = [];
        for (let x = 0; x < 4; x++) {
          if (board[x][y] !== null) {
            column.push(board[x][y]);
          }
        }
        for (let x = column.length - 1; x > 0; x--) {
          if (column[x] === column[x - 1]) {
            column[x] *= 2;
            score += column[x];
            column.splice(x - 1, 1);
          }
        }
        while (column.length < 4) {
          column.unshift(null);
        }
        for (let x = 0; x < 4; x++) {
          if (board[x][y] !== column[x]) {
            moved = true;
          }
          board[x][y] = column[x];
        }
      }
    }

    if (moved) {
      addRandomTile();
      checkGameOver();
    }
  }

  function checkGameOver() {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (board[x][y] === null) {
          return;
        }
        if (x < 3 && board[x][y] === board[x + 1][y]) {
          return;
        }
        if (y < 3 && board[x][y] === board[x][y + 1]) {
          return;
        }
      }
    }
    gameOver = true;
  }

  onMount(() => {
    initializeBoard();
    window.addEventListener('keydown', handleKeydown);
  });

  function handleKeydown(event) {
    if (gameOver) return;
    switch (event.key) {
      case 'ArrowLeft':
        move('left');
        break;
      case 'ArrowRight':
        move('right');
        break;
      case 'ArrowUp':
        move('up');
        break;
      case 'ArrowDown':
        move('down');
        break;
    }
  }
</script>

<style>
  .board {
    display: grid;
    grid-template-columns: repeat(4, 100px);
    grid-template-rows: repeat(4, 100px);
    gap: 10px;
    margin: 20px auto;
    width: 450px;
  }
  .cell {
    width: 100px;
    height: 100px;
    background-color: lightgray;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
  }
  .score {
    text-align: center;
    font-size: 24px;
    margin-top: 20px;
  }
</style>

<div class="score">スコア: {score}</div>
<div class="board">
  {#each board as row}
    {#each row as cell}
      <div class="cell">{cell}</div>
    {/each}
  {/each}
</div>
{#if gameOver}
  <div class="score">ゲームオーバー</div>
{/if}
