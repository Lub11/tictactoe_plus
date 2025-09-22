class UltimateTicTacToe {
    constructor() {
        this.currentPlayer = 'X';
        this.nextBoard = null; // null means any board for first move
        this.gameOver = false;
        this.winner = null;
        
        // 3x3 grid of small boards, each is a 3x3 grid
        this.boards = Array(9).fill().map(() => Array(9).fill(null));
        // Track winners of each big board
        this.bigBoardWinners = Array(9).fill(null);
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.renderGame();
        this.updateStatus();
    }

    setupEventListeners() {
        document.getElementById('restart').addEventListener('click', () => {
            this.restartGame();
        });
    }

    getBigBoardIndex(row, col) {
        return Math.floor(row / 3) * 3 + Math.floor(col / 3);
    }

    getSmallBoardIndex(bigIndex, smallRow, smallCol) {
        const bigRow = Math.floor(bigIndex / 3);
        const bigCol = bigIndex % 3;
        return (bigRow * 3 + smallRow) * 9 + (bigCol * 3 + smallCol);
    }

    makeMove(bigIndex, smallIndex) {
        if (this.gameOver) return false;
        
        // Check if move is allowed in this big board
        if (this.nextBoard !== null && bigIndex !== this.nextBoard) {
            return false;
        }

        // Check if small cell is already occupied or big board is won
        if (this.boards[bigIndex][smallIndex] !== null || 
            this.bigBoardWinners[bigIndex] !== null) {
            return false;
        }

        // Make the move
        this.boards[bigIndex][smallIndex] = this.currentPlayer;

        // Check if this move wins the small board
        if (this.checkSmallBoardWinner(bigIndex, this.currentPlayer)) {
            this.bigBoardWinners[bigIndex] = this.currentPlayer;
            
            // Check if this wins the big game
            if (this.checkBigGameWinner(this.currentPlayer)) {
                this.gameOver = true;
                this.winner = this.currentPlayer;
            }
        }

        // Determine next board
        this.nextBoard = this.bigBoardWinners[smallIndex] === null ? smallIndex : null;

        // Switch player if game is not over
        if (!this.gameOver) {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }

        this.renderGame();
        this.updateStatus();
        return true;
    }

    checkSmallBoardWinner(boardIndex, player) {
        const board = this.boards[boardIndex];
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        return winPatterns.some(pattern => 
            pattern.every(index => board[index] === player)
        );
    }

    checkBigGameWinner(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        return winPatterns.some(pattern => 
            pattern.every(index => this.bigBoardWinners[index] === player)
        );
    }

    renderGame() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        for (let bigRow = 0; bigRow < 3; bigRow++) {
            for (let bigCol = 0; bigCol < 3; bigCol++) {
                const bigIndex = bigRow * 3 + bigCol;
                const bigCell = document.createElement('div');
                bigCell.className = 'big-cell';
                
                // Add classes for styling based on state
                if (this.bigBoardWinners[bigIndex] === 'X') {
                    bigCell.classList.add('won-by-X');
                } else if (this.bigBoardWinners[bigIndex] === 'O') {
                    bigCell.classList.add('won-by-O');
                }
                
                if (this.nextBoard === bigIndex || (this.nextBoard === null && this.bigBoardWinners[bigIndex] === null)) {
                    bigCell.classList.add('active');
                }

                // Create small cells
                for (let smallRow = 0; smallRow < 3; smallRow++) {
                    for (let smallCol = 0; smallCol < 3; smallCol++) {
                        const smallIndex = smallRow * 3 + smallCol;
                        const smallCell = document.createElement('button');
                        smallCell.className = 'small-cell';
                        
                        const cellValue = this.boards[bigIndex][smallIndex];
                        if (cellValue) {
                            smallCell.textContent = cellValue;
                            smallCell.classList.add(cellValue);
                            smallCell.disabled = true;
                        } else {
                            smallCell.textContent = '';
                            smallCell.disabled = this.gameOver || 
                                (this.nextBoard !== null && this.nextBoard !== bigIndex) ||
                                this.bigBoardWinners[bigIndex] !== null;
                            
                            smallCell.addEventListener('click', () => {
                                this.makeMove(bigIndex, smallIndex);
                            });
                        }
                        
                        bigCell.appendChild(smallCell);
                    }
                }
                
                gameBoard.appendChild(bigCell);
            }
        }
    }

    updateStatus() {
        const statusElement = document.getElementById('status');
        const nextBoardElement = document.getElementById('next-board');

        if (this.gameOver) {
            statusElement.textContent = `Game Over! Player ${this.winner} wins!`;
            statusElement.style.color = this.winner === 'X' ? '#e53e3e' : '#38a169';
        } else {
            statusElement.textContent = `Player ${this.currentPlayer}'s turn`;
            statusElement.style.color = '#4a5568';
        }

        if (this.nextBoard === null) {
            nextBoardElement.textContent = 'Next move: Any available board';
        } else {
            const row = Math.floor(this.nextBoard / 3);
            const col = this.nextBoard % 3;
            nextBoardElement.textContent = `Next move: Board (${row + 1}, ${col + 1})`;
        }
    }

    restartGame() {
        this.currentPlayer = 'X';
        this.nextBoard = null;
        this.gameOver = false;
        this.winner = null;
        this.boards = Array(9).fill().map(() => Array(9).fill(null));
        this.bigBoardWinners = Array(9).fill(null);
        this.initializeGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new UltimateTicTacToe();
});