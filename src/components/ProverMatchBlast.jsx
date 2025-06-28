import { useEffect, useRef, useState } from "react";

const tileSize = 64;
const types = ["avatar1", "avatar2", "avatar3", "avatar4", "avatar5"];
const levelSettings = {
  1: { cols: 8, rows: 6, time: 150 },
  2: { cols: 8, rows: 8, time: 150 },
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

function createBoard(level) {
  const { cols, rows } = levelSettings[level];
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
  const [board, setBoard] = useState(() => createBoard(1));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [scoreL1, setScoreL1] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(levelSettings[1].time);
  const [showEndScreen, setShowEndScreen] = useState(false);

  const { cols, rows } = levelSettings[level];

  useEffect(() => {
    drawBoard();
  }, [board, selected]);

  useEffect(() => {
    if (showEndScreen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleLevelEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [level, showEndScreen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener("mousedown", handleClickOrTouch);
    canvas.addEventListener("touchstart", handleClickOrTouch);
    return () => {
      canvas.removeEventListener("mousedown", handleClickOrTouch);
      canvas.removeEventListener("touchstart", handleClickOrTouch);
    };
  });

  function handleLevelEnd() {
    if (level === 1) {
      setScoreL1(score);
    }
    setShowEndScreen(true);
  }

  function startNextLevel() {
    setLevel(2);
    setBoard(createBoard(2));
    setTimeLeft(levelSettings[2].time);
    setShowEndScreen(false);
  }

  function drawBoard() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const type = board[y][x];
        if (type && images[type]) {
          ctx.drawImage(images[type], x * tileSize, y * tileSize, tileSize, tileSize);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }

    if (selected) {
      ctx.strokeStyle = "magenta";
      ctx.lineWidth = 3;
      ctx.strokeRect(selected.x * tileSize, selected.y * tileSize, tileSize, tileSize);
    }
  }

  function getTileAtPosition(x, y) {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: Math.floor((x - rect.left) / tileSize),
      y: Math.floor((y - rect.top) / tileSize),
    };
  }

  function isValidSwap(a, b) {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }

  function cloneBoard(b) {
    return b.map((row) => [...row]);
  }

  function swapTiles(pos1, pos2, b = board) {
    const temp = cloneBoard(b);
    const t = temp[pos1.y][pos1.x];
    temp[pos1.y][pos1.x] = temp[pos2.y][pos2.x];
    temp[pos2.y][pos2.x] = t;
    return temp;
  }

  function findMatches(b) {
    const matches = [];

    // Horizontal
    for (let y = 0; y < rows; y++) {
      let match = [0];
      for (let x = 1; x < cols; x++) {
        if (b[y][x] === b[y][x - 1]) match.push(x);
        else {
          if (match.length >= 3) match.forEach((m) => matches.push({ x: m, y }));
          match = [x];
        }
      }
      if (match.length >= 3) match.forEach((m) => matches.push({ x: m, y }));
    }

    // Vertical
    for (let x = 0; x < cols; x++) {
      let match = [0];
      for (let y = 1; y < rows; y++) {
        if (b[y][x] === b[y - 1][x]) match.push(y);
        else {
          if (match.length >= 3) match.forEach((m) => matches.push({ x, y: m }));
          match = [y];
        }
      }
      if (match.length >= 3) match.forEach((m) => matches.push({ x, y: m }));
    }

    return matches;
  }

  function removeMatchesAndDrop(b, matchList = null) {
    const matches = matchList ?? findMatches(b);
    if (matches.length === 0) {
      setIsProcessing(false);
      return;
    }

    const newBoard = cloneBoard(b);
    matches.forEach(({ x, y }) => {
      newBoard[y][x] = null;
    });

    for (let x = 0; x < cols; x++) {
      const col = newBoard.map((row) => row[x]).filter(Boolean);
      while (col.length < rows) col.unshift(getRandomType());
      for (let y = 0; y < rows; y++) {
        newBoard[y][x] = col[y];
      }
    }

    setScore((s) => s + matches.length * 10);
    setBoard(newBoard);
    setTimeout(() => removeMatchesAndDrop(newBoard), 250);
  }

  function handleClickOrTouch(e) {
    if (isProcessing || showEndScreen) return;
    const isTouch = e.type.includes("touch");
    const pos = isTouch
      ? getTileAtPosition(e.touches[0].clientX, e.touches[0].clientY)
      : getTileAtPosition(e.clientX, e.clientY);

    if (!selected) {
      setSelected(pos);
    } else {
      if (selected.x === pos.x && selected.y === pos.y) {
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
          setTimeout(() => removeMatchesAndDrop(swapped, matches), 250);
        } else {
          setSelected(null);
        }
      } else {
        setSelected(pos);
      }
    }
  }

  function formatTime(s) {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${(s % 60).toString().padStart(2, "0")}`;
  }

  function shareToX() {
    const message =
      level === 2
        ? `Saya mendapat skor ${scoreL1 + score} di Prover Match Blast (Level 1: ${scoreL1}, Level 2: ${score})`
        : `Saya mendapat skor ${score} di Level 1 Prover Match Blast!`;

    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(
      message
    )}&url=https://proverhub.vercel.app`;

    window.open(url, "_blank");
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

      {!showEndScreen ? (
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
      ) : (
        <div className="text-center text-white mt-10">
          <h2 className="text-2xl text-pink-400 font-bold mb-2">
            {level === 1 ? "Ronde 1 Selesai" : "Game Over"}
          </h2>
          <p className="mb-2">Score {level === 1 ? score : `${scoreL1} + ${score} = ${scoreL1 + score}`}</p>
          {level === 1 ? (
            <div className="space-y-2 mt-4">
              <button
                onClick={startNextLevel}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                ▶️ Lanjut Ronde 2
              </button>
              <button
                onClick={shareToX}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                🚀 Share ke X
              </button>
            </div>
          ) : (
            <button
              onClick={shareToX}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4"
            >
              🚀 Share ke X
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProverMatchBlast;
