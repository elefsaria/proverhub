import { useEffect, useRef, useState } from "react";

const tileSize = 48;
const boardSize = 8;
const types = ["avatar1", "avatar2", "avatar3", "avatar4", "avatar5"];

function getRandomType() {
  return types[Math.floor(Math.random() * types.length)];
}

function createBoard() {
  return Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, getRandomType)
  );
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

export default function ProverMatchBlast({ onClose }) {
  const canvasRef = useRef(null);
  const [board, setBoard] = useState(createBoard());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [selected, setSelected] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = tileSize * boardSize;
    canvas.height = tileSize * boardSize;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
          const type = board[y][x];
          const img = new Image();
          img.src = `/assets/match-blast/${type}.png`;
          img.onload = () => {
            ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
            if (selected?.x === x && selected?.y === y) {
              ctx.strokeStyle = "white";
              ctx.lineWidth = 3;
              ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
          };
        }
      }
    };

    draw();
  }, [board, selected]);

  function getTileAtPosition(x, y) {
    const rect = canvasRef.current.getBoundingClientRect();
    const tileX = Math.floor((x - rect.left) / tileSize);
    const tileY = Math.floor((y - rect.top) / tileSize);
    return { x: tileX, y: tileY };
  }

  function swapTiles(pos1, pos2) {
    const newBoard = cloneBoard(board);
    const temp = newBoard[pos1.y][pos1.x];
    newBoard[pos1.y][pos1.x] = newBoard[pos2.y][pos2.x];
    newBoard[pos2.y][pos2.x] = temp;
    return newBoard;
  }

  function isValidSwap(pos1, pos2) {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    return dx + dy === 1;
  }

  function findMatches(b) {
    const matches = [];

    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize - 2; x++) {
        const t = b[y][x];
        if (t === b[y][x + 1] && t === b[y][x + 2]) {
          matches.push({ x, y }, { x: x + 1, y }, { x: x + 2, y });
        }
      }
    }

    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize - 2; y++) {
        const t = b[y][x];
        if (t === b[y + 1][x] && t === b[y + 2][x]) {
          matches.push({ x, y }, { x, y: y + 1 }, { x, y: y + 2 });
        }
      }
    }

    return matches;
  }

  function removeMatchesAndDrop() {
    const matches = findMatches(board);
    if (matches.length === 0) {
      setIsProcessing(false);
      return;
    }

    const newBoard = cloneBoard(board);
    matches.forEach(({ x, y }) => {
      newBoard[y][x] = null;
    });

    for (let x = 0; x < boardSize; x++) {
      let col = newBoard.map((row) => row[x]);
      col = col.filter((val) => val !== null);
      while (col.length < boardSize) {
        col.unshift(getRandomType());
      }
      for (let y = 0; y < boardSize; y++) {
        newBoard[y][x] = col[y];
      }
    }

    setBoard(newBoard);
    setScore((s) => s + matches.length * 10);
    if (score + matches.length * 10 > level * 100) {
      setLevel((l) => l + 1);
    }

    setTimeout(removeMatchesAndDrop, 300);
  }

  function handleClickOrTouch(e) {
    if (isProcessing) return;

    const isTouch = e.type.startsWith("touch");
    const pos = isTouch
      ? getTileAtPosition(e.touches[0].clientX, e.touches[0].clientY)
      : getTileAtPosition(e.clientX, e.clientY);

    if (!selected) {
      setSelected(pos);
    } else {
      if (
        pos.x === selected.x &&
        pos.y === selected.y
      ) {
        setSelected(null);
        return;
      }

      if (isValidSwap(selected, pos)) {
        const swapped = swapTiles(selected, pos);
        setBoard(swapped);
        setSelected(null);
        setIsProcessing(true);
        setTimeout(removeMatchesAndDrop, 300);
      } else {
        setSelected(pos);
      }
    }
  }

  function handleRestart() {
    setBoard(createBoard());
    setScore(0);
    setLevel(1);
    setSelected(null);
  }

  function shareToX() {
    const text = encodeURIComponent(
      `🎮 Aku main Prover Match Blast dan dapat skor ${score}! Coba juga yuk di ProverHub!`
    );
    const url = encodeURIComponent("https://proverhub.vercel.app");
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(shareUrl, "_blank");
  }

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-[420px] max-w-[90vw] text-black text-center relative">
        <button onClick={onClose} className="absolute right-3 top-2 text-pink-500 text-xl font-bold">✖</button>
        <h1 className="text-2xl font-bold mb-2 text-pink-500">Prover Match Blast</h1>
        <div className="flex justify-between px-4 text-sm font-bold mb-2">
          <span>Score: {score}</span>
          <span>Level: {level}</span>
        </div>
        <canvas
          ref={canvasRef}
          onClick={handleClickOrTouch}
          onTouchStart={handleClickOrTouch}
          className="rounded bg-pink-100 mx-auto border border-pink-400"
        />
        <div className="flex gap-2 justify-center mt-4">
          <button onClick={shareToX} className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">🔗 Share ke X</button>
          <button onClick={handleRestart} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">🔁 Ulangi</button>
        </div>
      </div>
    </div>
  );
}
