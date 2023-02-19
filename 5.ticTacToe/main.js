const boardElement = document.getElementById('board');
const turnElement = document.querySelector('#turn');

const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

// 0 = user, 1 = pc
let turn = 0;

startGame();

function startGame() {
    renderBoard();

    turn = Math.random() <= 0.5 ? 0 : 1;

    renderCurrentPlayer();

    if (turn === 0) {
        playerPlays();
    } else {
        pcPlays();
    }
}

function renderBoard() {
    const html = board.map((row) => {
        const cells = row.map((cell) => {
            return `
                <button class="cell">
                    ${cell}
                </button>
            `;
        });

        return `
            <div class="row">
                ${cells.join('')}
            </div>
        `;
    });

    boardElement.innerHTML = html.join('');
}

function renderCurrentPlayer() {
    turnElement.textContent = `${turn === 0 ? 'Your turn' : 'PC turn'}`;
}

function playerPlays() {
    const cells = document.querySelectorAll('.cell');

    cells.forEach((cell, i) => {
        const row = i % 3;
        const col = parseInt(i / 3);

        if (board[row][col] === '') {
            cell.addEventListener('click', function (e) {
                board[col][row] = 'O';
                cell.textContent = board[col][row];
                turn = 1;

                const won = checkWinner();

                if (won === 'none') {
                    pcPlays();
                    return;
                }

                if (won === 'draw') {
                    renderDraw();
                    cell.removeEventListener('click', this);
                    return;
                }
            });
        }
    });
}

function pcPlays() {
    renderCurrentPlayer();

    setTimeout(() => {
        let played = false;
        const options = checkIfCanWin();

        if (options.length > 0) {
            const bestOption = options[0];

            for (let i = 0; i < bestOption.length; i++) {
                if (bestOption[i].value === 0) {
                    const posI = bestOption[i].i;
                    const posJ = bestOption[i].j;

                    board[posI][posJ] = 'X';

                    played = true;
                    break;
                }
            }
        } else {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] === '' && !played) {
                        board[i][j] = 'X';
                        played = true;
                    }
                }
            }
        }

        turn = 0;
        renderBoard();
        renderCurrentPlayer();

        const won = checkWinner();

        if (won === 'none') {
            playerPlays();
            return;
        }

        if (won === 'draw') {
            renderDraw();
            return;
        }
    }, 2000);
}

function checkIfCanWin() {
    const arr = JSON.parse(JSON.stringify(board));

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (arr[i][j] === 'X') {
                arr[i][j] = { value: 1, i, j };
            }

            if (arr[i][j] === '') {
                arr[i][j] = { value: 0, i, j };
            }

            if (arr[i][j] === 'O') {
                arr[i][j] = { value: -2, i, j };
            }
        }
    }

    const p1 = arr[0][0];
    const p2 = arr[0][1];
    const p3 = arr[0][2];
    const p4 = arr[1][0];
    const p5 = arr[1][1];
    const p6 = arr[1][2];
    const p7 = arr[2][0];
    const p8 = arr[2][1];
    const p9 = arr[2][2];

    const s1 = [p1, p2, p3];
    const s2 = [p4, p5, p6];
    const s3 = [p7, p8, p9];
    const s4 = [p1, p4, p7];
    const s5 = [p2, p5, p8];
    const s6 = [p3, p6, p9];
    const s7 = [p1, p5, p9];
    const s8 = [p3, p5, p7];

    const res = [s1, s2, s3, s4, s5, s6, s7, s8].filter((line) => {
        return (
            line[0].value + line[1].value + line[2].value === 2 ||
            line[0].value + line[1].value + line[2].value === -4
        );
    });

    return res;
}

function checkWinner() {
    const p1 = board[0][0];
    const p2 = board[0][1];
    const p3 = board[0][2];
    const p4 = board[1][0];
    const p5 = board[1][1];
    const p6 = board[1][2];
    const p7 = board[2][0];
    const p8 = board[2][1];
    const p9 = board[2][2];

    const pcWon = [
        p1 === 'X' && p5 === 'X' && p9 === 'X',
        p7 === 'X' && p5 === 'X' && p3 === 'X',
        p1 === 'X' && p4 === 'X' && p7 === 'X',
        p2 === 'X' && p5 === 'X' && p8 === 'X',
        p3 === 'X' && p6 === 'X' && p9 === 'X',
        p1 === 'X' && p2 === 'X' && p3 === 'X',
        p4 === 'X' && p5 === 'X' && p6 === 'X',
        p7 === 'X' && p8 === 'X' && p9 === 'X',
    ];

    const playerWon = [
        p1 === 'O' && p5 === 'O' && p9 === 'O',
        p7 === 'O' && p5 === 'O' && p3 === 'O',
        p1 === 'O' && p4 === 'O' && p7 === 'O',
        p2 === 'O' && p5 === 'O' && p8 === 'O',
        p3 === 'O' && p6 === 'O' && p9 === 'O',
        p1 === 'O' && p2 === 'O' && p3 === 'O',
        p4 === 'O' && p5 === 'O' && p6 === 'O',
        p7 === 'O' && p8 === 'O' && p9 === 'O',
    ];

    //There is a winner
    if (pcWon.includes(true)) {
        turnElement.textContent = 'PC WINS';
        return 'pcwon';
    }

    if (playerWon.includes(true)) {
        turnElement.textContent = 'PLAYER WINS';
        return 'playerwon';
    }

    let draw = true;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === '') {
                draw = false;
            }
        }
    }

    return draw ? 'draw' : 'none';
}

function renderDraw() {
    turnElement.textContent = 'Draw';
}
