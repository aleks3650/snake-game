import React, { useState, useEffect } from "react";

function App() {
  const [snake, setSnake] = useState([[5, 5]]);
  const [direction, setDirection] = useState("right");
  const [isMoving, setIsMoving] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [foodPosition, SetFoodPosition] = useState([10, 10]);
  const [score, setScore] = useState(0);

  const Board = ({ snake }) => {
    const cells = [];
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        const isSnakeCell = snake.some(
          (cell) => cell[0] === i && cell[1] === j
        );
        const isFoodCell = foodPosition[0] === i && foodPosition[1] === j;

        const cellContent = isSnakeCell ? "snake" : isFoodCell ? "food" : "";

        cells.push(
          <div key={`${i}-${j}`} className={`cell ${cellContent}`}></div>
        );
      }
    }
    return <div className="board">{cells}</div>;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "ArrowRight" || e.key === "d") && direction !== "left")
        setDirection("right");
      if ((e.key === "ArrowLeft" || e.key === "a") && direction !== "right")
        setDirection("left");
      if ((e.key === "ArrowUp" || e.key === "w") && direction !== "down")
        setDirection("up");
      if ((e.key === "ArrowDown" || e.key === "s") && direction !== "up")
        setDirection("down");
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction]);

  function handleEndGame(head) {
    if (head[0] === -1 || head[0] === 20 || head[1] === -1 || head[1] === 20) {
      setGameOver(true);
      return;
    }
    for (let i = 1; i < snake.length; i++) {
      if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
        setGameOver(true);
        return;
      }
    }
  }

  useEffect(() => {
    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = [...newSnake[0]];

        handleEndGame(head);

        if (head[0] === foodPosition[0] && head[1] === foodPosition[1]) {
          const newHead = [foodPosition[0], foodPosition[1]];
          newSnake.unshift(newHead);
          let newFood;
          do {
            newFood = [
              Math.floor(Math.random() * 20),
              Math.floor(Math.random() * 20),
            ];
          } while (
            newSnake.some(
              (cell) => cell[0] === newFood[0] && cell[1] === newFood[1]
            )
          );

          SetFoodPosition(newFood);
          setScore((score) => score + 0.5);
        }

        if (direction === "right") head[1] += 1;
        if (direction === "left") head[1] -= 1;
        if (direction === "up") head[0] -= 1;
        if (direction === "down") head[0] += 1;

        newSnake.unshift(head);
        newSnake.pop();
        return newSnake;
      });
      setIsMoving(false);
    };

    if (!isMoving) {
      setIsMoving(true);
      moveSnake();
    }

    const intervalId = setInterval(() => {
      if (!isMoving) {
        setIsMoving(true);
        moveSnake();
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, [direction, isMoving, foodPosition]);
  return (
    <div className="all">
      <div className="Title">SNAKE GAME Score: {score}</div>
      {gameOver ? (
        <>
          <h1>GAME OVER</h1>
          <button className="Restart" onClick={() => window.location.reload()}>
            RESTART
          </button>
        </>
      ) : (
        <Board snake={snake} />
      )}
    </div>
  );
}

export default App;
