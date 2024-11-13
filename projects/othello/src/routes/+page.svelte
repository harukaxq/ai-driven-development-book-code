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
