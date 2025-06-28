import { useEffect, useRef, useState } from "react";

const gridSize = 8;
const tileSize = 64;
const images = [
  "/assets/match-blast/avatar1.png",
  "/assets/match-blast/avatar2.png",
  "/assets/match-blast/avatar3.png",
  "/assets/match-blast/avatar4.png",
  "/assets/match-blast/avatar5.png",
];
const levelTimes = [120, 90, 60]; // seconds for levels 1, 2, 3

export default function ProverMatchBlast({ onClose }) {
  const canvasRef = useRef(null);
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(levelTimes[0]);
  const [gameOver, setGameOver] = useState(false);

  const audioMatch = new Audio("/assets/sfx/match.mp3");

  // initialize board
  useEffect(() => {
    const newBoard = Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill(null)
          .map(() => Math.floor(Math.random() * images.length))
      );
    setBoard(newBoard);
  }, []);

  // handle timer
  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    draw();
  }, [board]);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    board.forEach((row, y) => {
      row.forEach((val, x) => {
        const img = new Image();
        img.src = images[val];
        img.onload = () => {
          ctx.fillStyle = "#333";
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
          ctx.strokeStyle = "#fff";
          ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        };
      });
    });
  };

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / tileSize);
    const y = Math.floor((e.clientY - rect.top) / tileSize);

    if (!selected) {
      setSelected({ x, y });
    } else {
      swapAndCheck(selected, { x, y });
      setSelected(null);
    }
  };

  const swapAndCheck = (a, b) => {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    if (dx + dy !== 1) return;

    const newBoard = board.map((row) => [...row]);
    [newBoard[a.y][a.x], newBoard[b.y][b.x]] = [
      newBoard[b.y][b.x],
      newBoard[a.y][a.x],
    ];
    setBoard(newBoard);
    checkMatches(newBoard);
  };

  const checkMatches = (newBoard) => {
    let matched = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize - 2; x++) {
        if (
          newBoard[y][x] === newBoard[y][x + 1] &&
          newBoard[y][x] === newBoard[y][x + 2]
        ) {
          matched.push({ x, y });
          matched.push({ x: x + 1, y });
          matched.push({ x: x + 2, y });
        }
      }
    }
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize - 2; y++) {
        if (
          newBoard[y][x] === newBoard[y + 1][x] &&
          newBoard[y][x] === newBoard[y + 2][x]
        ) {
          matched.push({ x, y });
          matched.push({ x, y: y + 1 });
          matched.push({ x, y: y + 2 });
        }
      }
    }

    if (matched.length > 0) {
      audioMatch.play();
      const unique = [...new Set(matched.map((m) => `${m.x},${m.y}`))];
      setScore((s) => s + unique.length * 10);

      const updatedBoard = newBoard.map((row) => [...row]);
      unique.forEach((coord) => {
        const [x, y] = coord.split(",").map(Number);
        updatedBoard[y][x] = null;
      });

      for (let x = 0; x < gridSize; x++) {
        for (let y = gridSize - 1; y >= 0; y--) {
          if (updatedBoard[y][x] === null) {
            for (let k = y - 1; k >= 0; k--) {
              if (updatedBoard[k][x] !== null) {
                updatedBoard[y][x] = updatedBoard[k][x];
                updatedBoard[k][x] = null;
                break;
              }
            }
          }
        }
      }

      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          if (updatedBoard[y][x] === null) {
            updatedBoard[y][x] = Math.floor(Math.random() * images.length);
          }
        }
      }

      setBoard(updatedBoard);
      setTimeout(() => checkMatches(updatedBoard), 400);
    }
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60)
      .toString()
      .padStart(2, "0");
    const s = (t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const resetGame = () => {
    const newBoard = Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill(null)
          .map(() => Math.floor(Math.random() * images.length))
      );
    setBoard(newBoard);
    setScore(0);
    setLevel(1);
    setTimeLeft(levelTimes[0]);
    setGameOver(false);
  };

  const shareToX = () => {
    const text = `🔥 Aku mencetak skor ${score} di level ${level} di game Prover Match Blast! Coba kalahkan aku di ProverHub!`;
    const url = "https://proverhub.vercel.app";
    const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(tweet, "_blank");
  };

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg text-center">
        <h1 className="text-2xl font-bold text-pink-500 mb-2">
          Prover Match Blast
        </h1>
        <div className="mb-2 text-sm text-pink-500 font-semibold">
          Score: {score} | Level: {level} | Time: {formatTime(timeLeft)}
        </div>
        <canvas
          ref={canvasRef}
          width={tileSize * gridSize}
          height={tileSize * gridSize}
          onClick={handleClick}
          onTouchEnd={(e) => {
            const touch = e.changedTouches[0];
            handleClick({ clientX: touch.clientX, clientY: touch.clientY });
          }}
        />
        {gameOver && (
          <div className="mt-4">
            <p className="text-lg font-semibold text-red-600">Waktu habis!</p>
            <button
              onClick={shareToX}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              🔗 Share ke X
            </button>
            <button
              onClick={resetGame}
              className="ml-2 mt-2 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            >
              🔄 Ulangi
            </button>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-pink-600 px-3 py-1 rounded hover:bg-pink-700"
        >
          ✖ Close
        </button>
      </div>
    </div>
  );
}
