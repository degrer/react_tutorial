import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" value={value} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function BoardRow({ row, value, handleChildClick }) {
  // 0〜2として受け取ったrowを3倍しておき、後にもう一つ3ループと合わせて0〜8の9個の一意なidにするためのオフセット
  const row_offset = parseInt(row) * 3;

  // squaresに
  const row_squares = [];
  for (let i of [...Array(3)].map((_, x) => x)) {
    let id = i + row_offset;
    row_squares.push(
      <Square value={value[id]} onSquareClick={() => handleChildClick(id)} />
    );
  }
  return <div className="board-row">{row_squares}</div>;
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calcWinner(squares);
  let status = winner
    ? "Winner : " + winner
    : "next player : " + (xIsNext ? "X" : "O");
  // イベントハンドラ
  function handleClick(i) {
    if (squares[i] || calcWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    const turn = xIsNext ? "X" : "O";
    nextSquares[i] = turn;

    onPlay(nextSquares);
  }
  // BoardRowを3回分rowsに貯める
  const rows = [];
  for (let i of [...Array(3)].map((_, x) => x)) {
    rows.push(
      <BoardRow
        row={i}
        value={squares}
        handleChildClick={(x) => handleClick(x)}
      />
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSequence = history[currentMove];

  function handlePlay(nextSequence) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSequence];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description = move > 0 ? "Go to move : " + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  return (
    <div className="game">
      <div className="game-mode">
        <Board
          xIsNext={xIsNext}
          squares={currentSequence}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calcWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
      return squares[a];
    }
  }
  return null;
}
