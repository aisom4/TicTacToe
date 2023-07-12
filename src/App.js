import { useState } from "react";
//using a hook to add state to the functional components within the code.

function Square({ value, onSquareClick }) {
  //our first functional component named square that accepts value and onSquareClick to handle the click event and display what is in the square.
  return (
    //rendering the output upon player's move and the button is rendered and the onSquareClick function is added and the class square is added. Value is used as a prop to dynamically display the the square's value.
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  //an additonal component named Board that uses 3 props: xIsNext, squares, and onPlay. Used to show the current player, storing current state of the game and handling the event (player making a move).
  function handleClick(i) {
    //a function within the Board component and it is used when a player makes a move and clicks a square.
    if (calculateWinner(squares) || squares[i]) {
      //Checking for a winner or if the square is already filled.
      return;
    }
    const nextSquares = squares.slice(); //a new array is created using a copy of the current one (squares) with the .slice method
    if (xIsNext) {
      nextSquares[i] = "X"; //square is updated based on isNext prop value.
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares); //calling a function to handle updating the nextSquares array.
  }

  const winner = calculateWinner(squares); //setting up calulateWinner function to determine the winner using the passed squares array.
  let status;
  if (winner) {
    //conditional to update status to show a winner or continue the game if there is no winner
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    //rendering the output of the above Board component. The value and onSquareClick props are added to the squares and the handle click function is assigned to the respective index.
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  //rendering the current move (this is the main component -signified by the export default).
  const [history, setHistory] = useState([Array(9).fill(null)]); //use state hook to initalize history and currentMove state variables. History state holds an array that shows the move history
  const [currentMove, setCurrentMove] = useState(0); //this state is tracking the current move's index
  const xIsNext = currentMove % 2 === 0; //determine which move based on the remainder of of current move. If current move is even then X will go
  const currentSquares = history[currentMove]; //gets the currentMove array corresponding with history.

  function handlePlay(nextSquares) {
    //handlePlay function that accepts the nextSquares which is the play event from the Board component
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; //an array is created using the move history and adding the current move
    setHistory(nextHistory); //history is updated with new array
    setCurrentMove(nextHistory.length - 1); //current move is set to index of previous move.
  }

  function jumpTo(nextMove) {
    // jumpTo function sets currentMove state to nextMove index.
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    //mapping over the history aray creating the list of moves
    let description; //description is updated in this section.
    if (move > 0) {
      description = "Go to move #" + move; //Shows the move number
    } else {
      description = "Go to game start"; //Or shows the start of the game.
    }
    return (
      //li element to showcase move and a button triggers the jumpTo function
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    //renders output of the game component. The move list are the child components.
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  //this function accepts the squares array and checks for the winning combination based on the square's number (logic- winners can win horizonally any row,vertically any column, and diagonally)
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //conditional to compare squares array's value to the lines array
      return squares[a]; //if a winner is declared the respective "X" or "O" will be shown
    }
  }
  return null; //no winner will return null
}
