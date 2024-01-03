let origBoard;
let huPlayer = "O";
let aiPlayer = "X";

const winCombos = [
  [0, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, 31, 32, 33, 34],
  [35, 36, 37, 38, 39, 40, 41],
  [42, 43, 44, 45, 46, 47, 48],
  [0, 7, 14, 21, 28, 35, 42],
  [1, 8, 15, 22, 29, 36, 43],
  [2, 9, 16, 23, 30, 37, 44],
  [3, 10, 17, 24, 31, 38, 45],
  [4, 11, 18, 25, 32, 39, 46],
  [5, 12, 19, 26, 33, 40, 47],
  [6, 13, 20, 27, 34, 41, 48],
  [0, 8, 16, 24, 32, 40, 48],
  [6, 12, 18, 24, 30, 36, 42],
];

const cells = document.querySelectorAll(".cell");
startGame();

function selectSym(sym) {
  huPlayer = sym;
  aiPlayer = sym === "O" ? "X" : "O";
  origBoard = Array.from(Array(49).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", turnClick, false);
  }
  if (aiPlayer === "X") {
    turn(bestSpot(), aiPlayer);
  }
  document.querySelector(".selectSym").style.display = "none";
}

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  document.querySelector(".endgame .text").innerText = "";
  document.querySelector(".selectSym").style.display = "block";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] === "number") {
    turn(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer) && !checkTie())
      turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
  checkTie();
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player === huPlayer ? "blue" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player === huPlayer ? "You win!" : "You lose");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return origBoard.filter((elm, i) => i === elm);
}

function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length === 0) {
    for (cell of cells) {
      cell.style.backgroundColor = "green";
      cell.removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie game");
    return true;
  }
  return false;
}

function minimax(newBoard, player, depth = 0, memo = {}) {
  const boardString = newBoard.join("");

  if (memo[boardString]) {
    return memo[boardString];
  }

  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, huPlayer)) {
    memo[boardString] = { score: -10 + depth };
    return memo[boardString];
  } else if (checkWin(newBoard, aiPlayer)) {
    memo[boardString] = { score: 10 - depth };
    return memo[boardString];
  } else if (availSpots.length === 0 || depth >= 3) {
    memo[boardString] = { score: 0 };
    return memo[boardString];
  }

  var moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === aiPlayer) {
      move.score = minimax(newBoard, huPlayer, depth + 1, memo).score;
    } else {
      move.score = minimax(newBoard, aiPlayer, depth + 1, memo).score;
    }

    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }

  // Sort the moves based on the score and player
  moves.sort((a, b) =>
    player === aiPlayer ? b.score - a.score : a.score - b.score
  );

  let bestMove, bestScore;
  if (player === aiPlayer) {
    bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  const result = moves[bestMove];
  memo[boardString] = result;
  return result;
}
