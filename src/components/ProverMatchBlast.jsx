import { useEffect, useRef, useState } from "react";

const tileSize = 64;
const cols = 8;
const rows = 8;
const types = ["avatar1", "avatar2", "avatar3", "avatar4", "avatar5"];

const images = {};
types.forEach((type) => {
  const img = new Image();
  img.src = `/assets/match-blast/${type}.png`;
  images[type] = img;
});

function getRandomType() {
  return types[Math.floor(Math.random() * types.length)];
}

function createBoard() {
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
  const [board, setBoard] = useState(createBoard);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    drawBoard();
  }, [board, selected]);

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
        // Garis pembatas
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
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

  function swapTiles(pos1, pos2, customBoard = null) {
    const tempBoard = customBoard ? cloneBoard(customBoard) : cloneBoard(board);
    const temp = tempBoard[pos1.y][pos1.x];
    tempBoard[pos1.y][pos1.x] = tempBoard[pos2.y][pos2.x];
    tempBoard[pos2.y][pos2.x] = temp;
    return tempBoard;
  }

  function positionsToKey(pos) {
    return `${pos.x},${pos.y}`;
  }

  function removeDuplicates(matches) {
    const seen = new Set();
    return matches.filter((m) => {
      const key = positionsToKey(m);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function findMatches(b) {
    const matches = [];

    // Horizontal
    for (let y = 0; y < rows; y++) {
      let matchLength = 1;
      for (let x = 1; x < cols; x++) {
        if (b[y][x] === b[y][x - 1]) {
          matchLength++;
        } else {
          if (matchLength >= 3) {
            for (let i = 0; i < matchLength; i++) {
              matches.push({ x: x - 1 - i, y });
            }
          }
          matchLength = 1;
        }
      }
      if (matchLength >= 3) {
        for (let i = 0; i < matchLength; i++) {
          matches.push({ x: cols - 1 - i, y });
        }
      }
    }

    // Vertical
    for (let x = 0; x < cols; x++) {
      let matchLength = 1;
      for (let y = 1; y < rows; y++) {
        if (b[y][x] === b[y - 1][x]) {
          matchLength++;
        } else {
          if (matchLength >= 3) {
            for (let i = 0; i < matchLength; i++) {
              matches.push({ x, y: y - 1 - i });
            }
          }
          matchLength = 1;
        }
      }
      if (matchLength >= 3) {
        for (let i = 0; i < matchLength; i++) {
          matches.push({ x, y: rows - 1 - i });
        }
      }
    }

    return matches;
  }

  function removeMatchesAndDrop(currentBoard, matchList = null) {
    let matches = matchList ?? findMatches(currentBoard);
    matches = removeDuplicates(matches);

    if (matches.length === 0) {
      setIsProcessing(false);
      return;
    }

    const newBoard = cloneBoard(currentBoard);
    matches.forEach(({ x, y }) => {
      newBoard[y][x] = null;
    });

    for (let x = 0; x < cols; x++) {
      let col = newBoard.map((row) => row[x]).filter((cell) => cell !== null);
      while (col.length < rows) {
        col.unshift(getRandomType());
      }
      for (let y = 0; y < rows; y++) {
        newBoard[y][x] = col[y];
      }
    }

    setBoard(newBoard);
    setScore((s) => s + matches.length * 10);
    setLevel((l) => Math.floor((score + matches.length * 10) / 100) + 1);

    setTimeout(() => removeMatchesAndDrop(newBoard), 300);
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
          setSelected(null); // Tidak valid, tidak diganti
        }
      } else {
        setSelected(pos);
      }
    }
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
      <h2 className="text-2xl text-white font-bold mb-2">Prover Match Blast</h2>
      <p className="text-white mb-4">Score: {score} | Level: {level}</p>
      <canvas
        ref={canvasRef}
        width={cols * tileSize}
        height={rows * tileSize}
        className="border-2 border-pink-500 rounded"
      />
    </div>
  );
}

export default ProverMatchBlast;
