document.addEventListener('DOMContentLoaded', () => {
    const scoreDisplay = document.getElementById('score');
    const gridDisplay = document.querySelector('.grid');
    const gameStatus = document.querySelector('.game-status');
    const result = document.getElementById('result');
    const restartBtn = document.getElementById('restart');
    const width = 4;

    let score = 0;
    let squares = [];

    // ----- MAIN -----
    createBoard();

    document.addEventListener('keyup', control);
    restartBtn.addEventListener('click', restartGame);
    // ----- END MAIN -----

    // Create a Playing Board
    function createBoard() {
        for (let x = 0; x < width * width; x++) {
            let square = document.createElement('div');
            square.classList.add('item');
            square.innerHTML = 0;
            gridDisplay.appendChild(square);

            squares.push(square);
        }

        generate();
        generate();
    }

    function generate() {
        let randNum = Math.floor(Math.random() * squares.length);

        if (squares[randNum].innerHTML == 0) {
            squares[randNum].innerHTML = 2;
            checkLose();
        } else {
            generate();
        }
    }

    //Swipe Right
    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML;
                let totalTwo = squares[i + 1].innerHTML;
                let totalThree = squares[i + 2].innerHTML;
                let totalFour = squares[i + 3].innerHTML;
                let row = [
                    parseInt(totalOne),
                    parseInt(totalTwo),
                    parseInt(totalThree),
                    parseInt(totalFour),
                ];

                let filteredRow = row.filter((num) => num);
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0);
                let newRow = zeros.concat(filteredRow);

                squares[i].innerHTML = newRow[0];
                squares[i + 1].innerHTML = newRow[1];
                squares[i + 2].innerHTML = newRow[2];
                squares[i + 3].innerHTML = newRow[3];
            }
        }
    }

    //Swipe Left
    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML;
                let totalTwo = squares[i + 1].innerHTML;
                let totalThree = squares[i + 2].innerHTML;
                let totalFour = squares[i + 3].innerHTML;
                let row = [
                    parseInt(totalOne),
                    parseInt(totalTwo),
                    parseInt(totalThree),
                    parseInt(totalFour),
                ];

                let filteredRow = row.filter((num) => num);
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0);
                let newRow = filteredRow.concat(zeros);

                squares[i].innerHTML = newRow[0];
                squares[i + 1].innerHTML = newRow[1];
                squares[i + 2].innerHTML = newRow[2];
                squares[i + 3].innerHTML = newRow[3];
            }
        }
    }

    //Move Down
    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML;
            let totalTwo = squares[i + width].innerHTML;
            let totalThree = squares[i + width * 2].innerHTML;
            let totalFour = squares[i + width * 3].innerHTML;

            let column = [
                parseInt(totalOne),
                parseInt(totalTwo),
                parseInt(totalThree),
                parseInt(totalFour),
            ];

            let filteredCol = column.filter((num) => num);
            let missing = 4 - filteredCol.length;
            let zeros = Array(missing).fill(0);
            let newCol = zeros.concat(filteredCol);

            squares[i].innerHTML = newCol[0];
            squares[i + width].innerHTML = newCol[1];
            squares[i + width * 2].innerHTML = newCol[2];
            squares[i + width * 3].innerHTML = newCol[3];
        }
    }

    //Move Up
    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML;
            let totalTwo = squares[i + width].innerHTML;
            let totalThree = squares[i + width * 2].innerHTML;
            let totalFour = squares[i + width * 3].innerHTML;

            let column = [
                parseInt(totalOne),
                parseInt(totalTwo),
                parseInt(totalThree),
                parseInt(totalFour),
            ];

            let filteredCol = column.filter((num) => num);
            let missing = 4 - filteredCol.length;
            let zeros = Array(missing).fill(0);
            let newCol = filteredCol.concat(zeros);

            squares[i].innerHTML = newCol[0];
            squares[i + width].innerHTML = newCol[1];
            squares[i + width * 2].innerHTML = newCol[2];
            squares[i + width * 3].innerHTML = newCol[3];
        }
    }

    //Combine Row
    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML) {
                let combinedTotal =
                    parseInt(squares[i].innerHTML) +
                    parseInt(squares[i + 1].innerHTML);

                squares[i].innerHTML = combinedTotal;
                squares[i + 1].innerHTML = 0;
                score += combinedTotal;
                scoreDisplay.innerHTML = score;
            }
        }

        checkWin();
    }

    //Combine Column
    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if (squares[i].innerHTML === squares[i + width].innerHTML) {
                let combinedTotal =
                    parseInt(squares[i].innerHTML) +
                    parseInt(squares[i + width].innerHTML);

                squares[i].innerHTML = combinedTotal;
                squares[i + width].innerHTML = 0;
                score += combinedTotal;
                scoreDisplay.innerHTML = score;
            }
        }

        checkWin();
    }

    //Assign Key codes
    function control(event) {
        if (event.keyCode === 39) {
            keyRight();
        } else if (event.keyCode === 37) {
            keyLeft();
        } else if (event.keyCode === 38) {
            keyUp();
        } else if (event.keyCode === 40) {
            keyDown();
        }
    }

    // Actions
    // Key Up
    function keyUp() {
        moveUp();
        combineColumn();
        moveUp();
        generate();
    }

    //Key Right
    function keyRight() {
        moveRight();
        combineRow();
        moveRight();
        generate();
    }

    //Key Down
    function keyDown() {
        moveDown();
        combineColumn();
        moveDown();
        generate();
    }

    //Key Left
    function keyLeft() {
        moveLeft();
        combineRow();
        moveLeft();
        generate();
    }

    // Handlers
    //Check for win
    function checkWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML === '2048') {
                gameStatus.classList.add('show');
                gameStatus.classList.remove('hide');
                result.innerHTML = 'You Win!';
                document.removeEventListener('keyup', control);
            }
        }
    }

    //Check for lose
    function checkLose() {
        let zeros = 0;

        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML === '0') {
                zeros++;
            }
        }

        if (zeros === 0) {
            gameStatus.classList.add('show');
            gameStatus.classList.remove('hide');
            result.innerHTML = 'You Lose!';
            document.removeEventListener('keyup', control);
        }
    }

    // Restart Game
    function restartGame() {
        gameStatus.classList.add('hide');
        gameStatus.classList.remove('show');
        gridDisplay.innerHTML = '';
        score = 0;
        scoreDisplay.innerHTML = score;
        createBoard();
    }
});
