import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button } from 'react-native';

// Component for rendering a square on the game board
function Square({ value, onClick, isDisabled }) {
  return (
    <View style={styles.box}>
      <TouchableOpacity onPress={onClick} style={styles.button} disabled={isDisabled}>
        <Text style={styles.text}>{value}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Function to check for a winner in the game
function calcWinner(squares) {
  // Define winning patterns (combinations of squares that lead to a win)
  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Check if any of the winning patterns match with the current board state
  for (let i = 0; i < winningPatterns.length; i++) {
    const [a, b, c] = winningPatterns[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Return the winning player ('X' or 'O')
    }
  }
  return ""; // Return an empty string if no winner yet
}

// Component for rendering the game board
function Board({ squares, isX, isDisabled, updateGame }) {
  const winner = calcWinner(squares);

  // Function to handle a square click
  const handleClick = (i) => {
    if (winner || squares[i]) {
      return; // Do nothing if there's a winner or the square is already filled
    }
    const newSquares = squares.slice();
    newSquares[i] = isX ? 'X' : 'O';
    updateGame(newSquares, !isX);
  };

  // Function to render an individual square
  const renderSquare = (i) => {
    return (
      <Square
        value={squares[i]}
        onClick={() => handleClick(i)}
        isDisabled={winner ? true : false}
      />
    );
  };
  
  // Function to render a row of squares
  const renderBoardRow = (rowIndex) => {
    return (
      <View style={styles.boardRow}>
        {renderSquare(3 * rowIndex)}
        {renderSquare(3 * rowIndex + 1)}
        {renderSquare(3 * rowIndex + 2)}
      </View>
    );
  };

  // Returning row of 3 squares in order
  return (
    <View style={styles.board}>
      {renderBoardRow(0)}
      {renderBoardRow(1)}
      {renderBoardRow(2)}
    </View>
  );
}

// Component for the Reset Board button
const ResetButton = ({ onReset }) => {
  return (
    <View style={styles.resetButtonContainer}>
      <Button title="Reset Board" onPress={onReset} />
    </View>
  );
};

// Function to generate the game message
const getMessage = (winner, isX, squares) => {
  const isBoardFull = squares.every((square) => square !== "");
  if (winner) {
    return `Winner: ${winner}`;
  } else if (isBoardFull) {
    return "It's a draw!";
  }
};

// Main app component
const YourApp = () => {
  // States
  const [reset, setReset] = React.useState(false);
  const [boardSquares, setBoardSquares] = React.useState(Array(9).fill(""));
  const [boardIsX, setBoardIsX] = React.useState(true);

  // Function to reset the game board
  const resetBoard = () => {
    setReset(!reset);
    setBoardSquares(Array(9).fill(""));
    setBoardIsX(true);
  };

  const winner = calcWinner(boardSquares);
  const isBoardFull = boardSquares.every((square) => square !== "");
  const isGameFinished = winner !== "" || isBoardFull;

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        {isGameFinished ? (
          <Text style={styles.message}>
            {getMessage(winner, boardIsX, boardSquares)}
          </Text>
        ) : null}
      </View>
      <Board
        key={reset}
        squares={boardSquares}
        isX={boardIsX}
        isDisabled={isGameFinished}
        updateGame={(newSquares, newIsX) => {
          setBoardSquares(newSquares);
          setBoardIsX(newIsX);
        }}
      />
      <ResetButton onReset={resetBoard} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  messageContainer: {
    height: 50, 
  },
  board: {
    width: "80%",
    aspectRatio: 1, 
    backgroundColor: "#7C6436", 
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4, 
    borderColor: "black", 
    maxWidth: 400,
  },
  boardRow: {
    flexDirection: "row",
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "#7C6436",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 90,
    height: 90,
    backgroundColor: "#8E713E", 
    borderWidth: 4,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonContainer: {
    marginTop: 10, 
    color: "red",
  },
  text: {
    fontSize: 24,
    color: "white",
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black"
  },
});

export default YourApp;