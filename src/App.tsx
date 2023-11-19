import { useState } from "react";
import React from "react";

type squareType = Array<string|null>;
type onPlayType = (nextSequence: squareType) => void;
type handleClickType = (i: number) => void;

type squareArgsType = {
  value: string|null,
  onSquareClick: React.MouseEventHandler<HTMLButtonElement>,
};
function Square({ value, onSquareClick }: squareArgsType) {
  value = value ? value : "";
  return (
    <button className="square" value={value} onClick={onSquareClick}>
      {value}
    </button>
  );
}

type boardRowArgsType = {
  row: number,
  square: squareType,
  handleChildClick: handleClickType,
};
function BoardRow({ row, square, handleChildClick }: boardRowArgsType) {
  // 0〜2として受け取ったrowを3倍しておき、後に3列のsquare3要素に足して0〜8の9個の一意なidにするためのオフセット
  const row_offset = row * 3;

  return (
    <div className="board-row">
      {[...Array(3).keys()].map((i) => {
        let id = i + row_offset;
        return (
          <Square value={square[id]} onSquareClick={() => handleChildClick(id)} />
        )
      })}
    </div>
  )
}

type boardArgsType = {
  xIsNext: boolean,
  squares: squareType,
  onPlay: onPlayType
};
function Board({ xIsNext, squares, onPlay }: boardArgsType) {
  const winner = calcWinner(squares);

  let status = winner
    ? "Winner : " + winner
    : "next player : " + (xIsNext ? "X" : "O");

  // イベントハンドラ
  function handleClick(i: number) {
    if (squares[i] || calcWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    const turn = xIsNext ? "X" : "O";
    nextSquares[i] = turn;

    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
        {[...Array(3).keys()].map((i) => {
          return (
            <BoardRow
              row={i}
              square={squares}
              handleChildClick={(x: number) => handleClick(x)}
            />
          );
        })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState<Array<squareType>>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const xIsNext : boolean = currentMove % 2 === 0;
  const currentSequence : squareType = history[currentMove];

  function handlePlay(nextSequence: squareType) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSequence];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number): void {
    setCurrentMove(nextMove);
  }

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
        <ol>{
          history.map((squares, move) => {
            let description = move > 0 ? "Go to move : " + move : "Go to game start";
            return (
              <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
              </li>
            );
          })
        }</ol>
      </div>
    </div>
  );
}


function calcWinner(squares: squareType): String | null {
  type LineType = Array<number>
  const lines: Array<LineType> = [
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
