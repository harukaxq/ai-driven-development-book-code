<script>
	import { onMount } from 'svelte';

	let grid = [];
	const size = 4;

	function initGrid() {
		grid = Array(size)
			.fill()
			.map(() => Array(size).fill(0));
		addRandomTile();
		addRandomTile();
	}

	function addRandomTile() {
		let emptyTiles = [];
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (grid[i][j] === 0) {
					emptyTiles.push({ x: i, y: j });
				}
			}
		}
		if (emptyTiles.length > 0) {
			let { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
			grid[x][y] = Math.random() < 0.9 ? 2 : 4;
		}
	}

	function move(direction) {
		let moved = false;
		if (direction === 'up' || direction === 'down') {
			for (let j = 0; j < size; j++) {
				let column = [];
				for (let i = 0; i < size; i++) {
					if (grid[i][j] !== 0) {
						column.push(grid[i][j]);
					}
				}
				if (direction === 'down') {
					column.reverse();
				}
				let mergedColumn = merge(column);
				if (direction === 'down') {
					mergedColumn.reverse();
				}
				for (let i = 0; i < size; i++) {
					if (grid[i][j] !== mergedColumn[i]) {
						grid[i][j] = mergedColumn[i];
						moved = true;
					}
				}
			}
		} else if (direction === 'left' || direction === 'right') {
			for (let i = 0; i < size; i++) {
				let row = grid[i].filter((val) => val !== 0);
				if (direction === 'right') {
					row.reverse();
				}
				let mergedRow = merge(row);
				if (direction === 'right') {
					mergedRow.reverse();
				}
				for (let j = 0; j < size; j++) {
					if (grid[i][j] !== mergedRow[j]) {
						grid[i][j] = mergedRow[j];
						moved = true;
					}
				}
			}
		}
		if (moved) {
			addRandomTile();
		}
	}

	function merge(tiles) {
		let merged = [];
		while (tiles.length > 0) {
			if (tiles.length > 1 && tiles[0] === tiles[1]) {
				merged.push(tiles[0] * 2);
				tiles.splice(0, 2);
			} else {
				merged.push(tiles[0]);
				tiles.splice(0, 1);
			}
		}
		while (merged.length < size) {
			merged.push(0);
		}
		return merged;
	}

	function checkGameOver() {
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (grid[i][j] === 0) {
					return false;
				}
				if (i < size - 1 && grid[i][j] === grid[i + 1][j]) {
					return false;
				}
				if (j < size - 1 && grid[i][j] === grid[i][j + 1]) {
					return false;
				}
			}
		}
		return true;
	}

	onMount(() => {
		initGrid();
		window.addEventListener('keydown', handleKeydown);
	});

	function handleKeydown(event) {
		switch (event.key) {
			case 'ArrowUp':
				move('up');
				break;
			case 'ArrowDown':
				move('down');
				break;
			case 'ArrowLeft':
				move('left');
				break;
			case 'ArrowRight':
				move('right');
				break;
		}
		if (checkGameOver()) {
			alert('Game Over');
		}
	}
</script>

<div class="grid">
	{#each grid as row}
		{#each row as tile}
			<div class="tile">{tile !== 0 ? tile : ''}</div>
		{/each}
	{/each}
</div>

<style>
	.grid {
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
		background-color: #ccc;
		font-size: 24px;
		font-weight: bold;
	}
</style>
