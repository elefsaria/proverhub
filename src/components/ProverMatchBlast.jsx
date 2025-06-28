import { useEffect, useRef, useState } from "react";

const tileSize = 64;
const types = ["avatar1", "avatar2", "avatar3", "avatar4", "avatar5"];
const levelConfig = {
  1: { rows: 6, cols: 8, duration: 150 },
  2: { rows: 8, cols: 8, duration: 150 },
};

const images = {};
types.forEach((type) => {
  const img = new Image();
  img.src = `/assets/match-blast/${type}.png`;
  images[type] = img;
});

function getRandomType() {
  return types[Math.floor(Math.random() * types.length)];
}

function createBoard(rows, cols) {
  const board = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      row.push(getRandomType());
    }
    board.push(row);
  }
  return board;
}

function ProverMatchBlast({ onClose }) {
  const canvasRef = useRef();
  const [level, setLevel] = useState(1);
  const [scoreLevel1, setScoreLevel1] = useState(0);
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState(() =>
    createBoard(levelConfig[1].rows, levelConfig[1].cols)
  );
  const [selected, setSelected] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(levelConfig[1].duration);
  const [gameState, setGameState] = useState("playing"); // playing, level1End, gameOver

  const rows = levelConfig[level].rows;
  const cols = levelConfig[level].cols;

  useEffect(() => {
    drawBoard();
  }, [board, selected]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          if (level === 1) {
            setScoreLevel1(score);
            setGameState("level1End");
          } else {
            setGameState("gameOver");
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [level, gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener("mousedown", handleClickOrTouch);
    canvas.addEventListener("touchstart", handleClickOrTouch);
    return () => {
      canvas.removeEventListener("mousedown", handleClickOrTouch);
      canvas.removeEventListener("touchstart", handleClickOrTouch);
    };
  });

  function drawBoard() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const type = board[y][x];
        if (type && images[type]) {
          ctx.drawImage(
            images[type],
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize
          );
        }
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }

    if (selected) {
      ctx.strokeStyle = "magenta";
      ctx.lineWidth = 3;
      ctx.strokeRect(
        selected.x * tileSize,
        selected.y * tileSize,
        tileSize,
        tileSize
      );
    }
  }

  function getTileAtPosition(x, y) {
    const rect = canvasRef.current.getBoundingClientRect();
    const localX = x - rect.left;
    const localY = y - rect.top;
    return {
      x: Math.floor(localX / tileSize),
      y: Math.floor(localY / tileSize),
    };
  }

  function isValidSwap(pos1, pos2) {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }

  function cloneBoard(b) {
    return b.map((row) => [...row]);
  }

  function swapTiles(pos1, pos2) {
    const newBoard = cloneBoard(board);
    const temp = newBoard[pos1.y][pos1.x];
    newBoard[pos1.y][pos1.x] = newBoard[pos2.y][pos2.x];
    newBoard[pos2.y][pos2.x] = temp;
    return newBoard;
  }

  function findMatches(b) {
    const matches = [];
    for (let y = 0; y < rows; y++) {
      let match = [0];
      for (let x = 1; x < cols; x++) {
        if (b[y][x] === b[y][x - 1]) {
          match.push(x);
        } else {
          if (match.length >= 3) match.forEach((m) => matches.push({ x: m, y }));
          match = [x];
        }
      }
      if (match.length >= 3) match.forEach((m) => matches.push({ x: m, y }));
    }

    for (let x = 0; x < cols; x++) {
      let match = [0];
      for (let y = 1; y < rows; y++) {
        if (b[y][x] === b[y - 1][x]) {
          match.push(y);
        } else {
          if (match.length >= 3) match.forEach((m) => matches.push({ x, y: m }));
          match = [y];
        }
      }
      if (match.length >= 3) match.forEach((m) => matches.push({ x, y: m }));
    }

    return matches;
  }

  function removeMatchesAndDrop(currentBoard, matchList = null) {
    const matches = matchList ?? findMatches(currentBoard);
    if (matches.length === 0) {
      setIsProcessing(false);
      return;
    }

    const newBoard = cloneBoard(currentBoard);
    matches.forEach(({ x, y }) => {
      newBoard[y][x] = null;
    });

    for (let x = 0; x < cols; x++) {
      const col = newBoard.map((row) => row[x]).filter(Boolean);
      while (col.length < rows) {
        col.unshift(getRandomType());
      }
      for (let y = 0; y < rows; y++) {
        newBoard[y][x] = col[y];
      }
    }

    setScore((s) => s + matches.length * 10);
    setBoard(newBoard);
    setTimeout(() => removeMatchesAndDrop(newBoard), 300);
  }

  function handleClickOrTouch(e) {
    if (isProcessing || gameState !== "playing") return;
    const isTouch = e.type.startsWith("touch");
    const pos = isTouch
      ? getTileAtPosition(e.touches[0].clientX, e.touches[0].clientY)
      : getTileAtPosition(e.clientX, e.clientY);

    if (!selected) {
      setSelected(pos);
    } else {
      if (pos.x === selected.x && pos.y === selected.y) {
        setSelected(null);
        return;
      }

      if (isValidSwap(selected, pos)) {
        const swapped = swapTiles(selected, pos);
        const matches = findMatches(swapped);
        if (matches.length > 0) {
          setBoard(swapped);
          setSelected(null);
          setIsProcessing(true);
          setTimeout(() => removeMatchesAndDrop(swapped, matches), 300);
        } else {
          setSelected(null);
        }
      } else {
        setSelected(pos);
      }
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
      <div className="absolute top-4 right-4">
        <button
          onClick={onClose}
          className="text-white text-lg bg-pink-500 hover:bg-pink-600 px-4 py-1 rounded"
        >
          ✖ Close
        </button>
      </div>

      {gameState === "playing" && (
        <>
          <h2 className="text-2xl text-pink-400 font-bold mb-2">Prover Match Blast</h2>
          <p className="text-pink-400 mb-2">
            Score: {score} | Level: {level} | Time: {formatTime(timeLeft)}
          </p>
          <canvas
            ref={canvasRef}
            width={cols * tileSize}
            height={rows * tileSize}
            className="border-2 border-pink-500 rounded"
          />
        </>
      )}

      {gameState === "level1End" && (
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold text-pink-400 mb-4">Level 1 Selesai</h2>
          <p className="mb-4">Score Level 1: {score}</p>
          <button
            onClick={() => {
              setLevel(2);
              setTimeLeft(levelConfig[2].duration);
              setScore(score); // tetap lanjutkan score
              setBoard(createBoard(levelConfig[2].rows, levelConfig[2].cols));
              setGameState("playing");
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-2"
          >
            ▶️ Lanjut Ronde 2
          </button>
          <button
            onClick={() => {
              const url = `https://x.com/intent/tweet?text=Saya mendapatkan skor ${score} di Prover Match Blast! Coba mainkan juga di https://proverhub.vercel.app`;
              window.open(url, "_blank");
            }}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
          >
            🚀 Share ke X
          </button>
        </div>
      )}

      {gameState === "gameOver" && (
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold text-pink-400 mb-4">Permainan Selesai</h2>
          <p className="mb-2">Score Level 1: {scoreLevel1}</p>
          <p className="mb-4">Score Level 2: {score - scoreLevel1}</p>
          <p className="mb-4 font-bold text-pink-300">Total: {score}</p>
          <button
            onClick={() => {
              const url = `https://x.com/intent/tweet?text=Saya menyelesaikan Prover Match Blast dengan total skor ${score} (Level 1: ${scoreLevel1}, Level 2: ${score - scoreLevel1})! Coba juga di https://proverhub.vercel.app`;
              window.open(url, "_blank");
            }}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
          >
            🚀 Share ke X
          </button>
        </div>
      )}
    </div>
  );
}

export default ProverMatchBlast;
