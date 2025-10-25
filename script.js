function Gameboard() {
    const rows = 3;
    const columns = rows;
    const board = [];

    const getBoard = () => board;
    
    const updateCell = (player) => {
        if (board[player.getCell().row][player.getCell().column] === "") {
            board[player.getCell().row][player.getCell().column] = player.marker;
            return true;
        }
        else
            return false;
    };

    const printBoard = () => {
        for (let i = 0; i < rows; i++)
            console.log(board[i]);
    };

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++)
                board[i].push("");
        }
    }

    resetBoard();

    return {getBoard, updateCell, printBoard, resetBoard};
}


// Player object
function Player(name, marker) {
    let selection = {};
    const selectCell = (row, column) => {
        selection = {row, column};
    }
    const getCell = () => selection;
    return {name, marker, getCell, selectCell};
}

// Game flow controller
function Game() {
    const board = Gameboard();
    const playerOne = Player("C moi", "X");
    const playerTwo = Player("C toi", "O");
    let activePlayer = playerOne;

// Play turn
    const getActivePlayer = () => activePlayer;

    const switchPlayer = () => {
        if (activePlayer === playerOne)
            activePlayer = playerTwo;
        else
            activePlayer = playerOne;
    };

    const printRound = () => {
        board.printBoard();
        console.log(`Player ${getActivePlayer().name}'s with the ${getActivePlayer().marker} marker turn.`);
    };

    const play = (row, column) => {
        if (0 < row < 3 && 0 < column < 3)
            getActivePlayer().selectCell(row, column);
        else
            console.log("Invalid selection!");
        let updateStatus = board.updateCell(getActivePlayer());
        if (!updateStatus) {
            console.log("Selected cell is already populated. Choose another one!");
            return updateStatus;
        };
        const gameWon = winCheck(getActivePlayer());
        switch (gameWon) {
            case 0:
                break;
            case 1:
                console.log(`Player ${getActivePlayer().name} won!`);
                board.resetBoard();
                break;
            case 2:
                board.printBoard();
                console.log("It's a tie!");
                board.resetBoard();
                break;
            default:
                console.log("default");
        }
        switchPlayer();
        printRound();
        return {updateStatus, gameWon};
    };

// Check winner
    const winCheck = (player) => {
        let populatedCells = 0;
        let upDiagCheck = 0;
        let downDiagCheck = 0;
        for (let i = 0; i < 3; i++) {
            let rowCheck = 0;
            let colCheck = 0;
            for (let j = 0; j < 3; j++) {
                if (board.getBoard()[i][j] === player.marker) {
                    populatedCells++;
                    rowCheck++;
                    if (i === j)
                        upDiagCheck++;
                    if (i + j === 2)
                        downDiagCheck++;
                }
                if (board.getBoard()[j][i] === player.marker)
                    colCheck++;
            }
            if (rowCheck === 3 || colCheck === 3 || upDiagCheck === 3 || downDiagCheck === 3)
                return 1;
        }
            if (populatedCells === 5)
                return 2;
            else
                return 0;
    };

    printRound();

    return {play, getActivePlayer, getBoard: board.getBoard};
}

function displayController() {
    const game = Game();
    const turnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const renderDisplay = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        turnDiv.textContent = `Player ${activePlayer.name}'s with the ${activePlayer.marker} marker turn.`;
        
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");

                cellButton.classList.add("cell");
                cellButton.setAttribute("data-row", rowIndex);
                cellButton.setAttribute("data-column", colIndex);

                cellButton.textContent = cell;
                boardDiv.appendChild(cellButton);
            })
        })
    };

    function clickCell(e) {
        const rowChoice = e.target.dataset.row;
        const colChoice = e.target.dataset.column;
        
        if (!rowChoice || !colChoice)
            return;

        const activePlayer = game.getActivePlayer();
        const {updateStatus: roundPlayed, gameWon} = game.play(rowChoice, colChoice);
        const spotTakenMessage = document.querySelector(".taken");
        const gameEndMessage = document.querySelector(".end");

        if (!roundPlayed && spotTakenMessage === null) {
            const spotTakenDiv = document.createElement("h2");
            spotTakenDiv.classList.add("taken");
            spotTakenDiv.textContent = "Selected cell is already populated. Choose another one!";
            boardDiv.after(spotTakenDiv);
        }
        else if (roundPlayed && spotTakenMessage) {
            boardDiv.parentNode.removeChild(spotTakenMessage);
        }

        switch (gameWon) {
            case 0:
                break;
            case 1: {
                const winMessageDiv = document.createElement("h2");
                winMessageDiv.classList.add("end");
                winMessageDiv.textContent = `Player ${activePlayer.name} won!`;
                boardDiv.after(winMessageDiv);
                break;
            }
            case 2: {
                const tieMessageDiv = document.createElement("h2");
                tieMessageDiv.classList.add("end");
                tieMessageDiv.textContent = "It's a tie!";
                boardDiv.after(tieMessageDiv);
                break;
            }
            default:
                console.log("default");
        }
        console.log(gameEndMessage);
        if (gameWon !== 1 && gameWon !== 2 && gameEndMessage)
            boardDiv.parentNode.removeChild(gameEndMessage);
        renderDisplay();
    }
    boardDiv.addEventListener("click", clickCell);

    renderDisplay();
}

displayController();