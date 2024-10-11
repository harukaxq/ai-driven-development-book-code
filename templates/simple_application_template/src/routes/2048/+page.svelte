<script>
    import { onMount, tick } from 'svelte';

    let board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    let score = 0; // スコア変数を追加
    let animationQueue = []; // アニメーションキューを追加

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
            animationQueue.push({ x, y, type: 'new' }); // 新しいタイルのアニメーションを追加
        }
    }

    async function moveLeft() {
        for (let i = 0; i < 4; i++) {
            let row = board[i].filter(val => val);
            let missing = 4 - row.length;
            let zeros = Array(missing).fill(0);
            board[i] = row.concat(zeros);
        }
        await tick(); // ア���メーションのためにtickを待つ
    }

    async function combineLeft() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === board[i][j + 1] && board[i][j] !== 0) {
                    board[i][j] *= 2;
                    board[i][j + 1] = 0;
                    score += board[i][j]; // スコアを更新
                    animationQueue.push({ x: i, y: j, type: 'merge' }); // マージアニメーションを追加
                }
            }
        }
        await tick(); // アニメーションのためにtickを待つ
    }

    function moveRight() {
        for (let i = 0; i < 4; i++) {
            let row = board[i].filter(val => val);
            let missing = 4 - row.length;
            let zeros = Array(missing).fill(0);
            board[i] = zeros.concat(row);
        }
    }

    function combineRight() {
        for (let i = 0; i < 4; i++) {
            for (let j = 3; j > 0; j--) {
                if (board[i][j] === board[i][j - 1] && board[i][j] !== 0) {
                    board[i][j] *= 2;
                    board[i][j - 1] = 0;
                    score += board[i][j]; // スコアを更新
                    animationQueue.push({ x: i, y: j - 1, type: 'merge' }); // マージアニメーションを追加
                }
            }
        }
    }

    function moveUp() {
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                if (board[i][j] !== 0) {
                    column.push(board[i][j]);
                }
            }
            let missing = 4 - column.length;
            let zeros = Array(missing).fill(0);
            for (let i = 0; i < 4; i++) {
                board[i][j] = column[i] || 0;
            }
        }
    }

    function combineUp() {
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 3; i++) {
                if (board[i][j] === board[i + 1][j] && board[i][j] !== 0) {
                    board[i][j] *= 2;
                    board[i + 1][j] = 0;
                    score += board[i][j]; // スコアを更新
                    animationQueue.push({ x: i, y: j, type: 'merge' }); // マージアニメーションを追加
                }
            }
        }
    }

    function moveDown() {
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                if (board[i][j] !== 0) {
                    column.push(board[i][j]);
                }
            }
            let missing = 4 - column.length;
            let zeros = Array(missing).fill(0);
            for (let i = 0; i < 4; i++) {
                board[i][j] = zeros[i] || column[i - missing] || 0;
            }
        }
    }

    function combineDown() {
        for (let j = 0; j < 4; j++) {
            for (let i = 3; i > 0; i--) {
                if (board[i][j] === board[i - 1][j] && board[i][j] !== 0) {
                    board[i][j] *= 2;
                    board[i - 1][j] = 0;
                    score += board[i][j]; // スコアを更新
                    animationQueue.push({ x: i - 1, y: j, type: 'merge' }); // マージアニメーションを追加
                }
            }
        }
    }

    function handleKeydown(event) {
        switch (event.key) {
            case 'ArrowLeft':
                moveLeft();
                combineLeft();
                moveLeft();
                addRandomTile();
                break;
            case 'ArrowRight':
                moveRight();
                combineRight();
                moveRight();
                addRandomTile();
                break;
            case 'ArrowUp':
                moveUp();
                combineUp();
                moveUp();
                addRandomTile();
                break;
            case 'ArrowDown':
                moveDown();
                combineDown();
                moveDown();
                addRandomTile();
                break;
        }
        animationQueue = []; // アニメーションキューをリセット
    }

    onMount(() => {
        addRandomTile();
        addRandomTile();
        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    });
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
        transition: transform 0.2s, background-color 0.2s;
    }
    .tile.new {
        animation: pop-in 0.2s;
    }
    .tile.merge {
        animation: merge 0.2s;
    }
    @keyframes pop-in {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }
    @keyframes merge {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(1.2);
        }
    }
    .score {
        font-size: 24px;
        margin-bottom: 20px;
    }
</style>

<div class="score">スコア: {score}</div> <!-- スコア表示を��加 -->
<div class="board">
    {#each board as row, i}
        {#each row as tile, j}
            <div class="tile {animationQueue.find(a => a.x === i && a.y === j)?.type}">
                {tile !== 0 ? tile : ''}
            </div>
        {/each}
    {/each}
</div>