// 📍 src/components/MatchBlast.jsx

import { useEffect, useRef, useState } from "react";
import "./MatchBlast.css";

const TILE_SIZE = 64;
const GRID_SIZE = 8;
const AVATARS = [
  "/assets/match-blast/avatar1.png",
  "/assets/match-blast/avatar2.png",
  "/assets/match-blast/avatar3.png",
  "/assets/match-blast/avatar4.png",
  "/assets/match-blast/avatar5.png"
];

export default function MatchBlast() {
  const canvasRef = useRef();
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);

  // Load initial grid
  useEffect(() => {
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE)
          .fill(null)
          .map(() => Math.floor(Math.random() * AVATARS.length))
      );
    setGrid(newGrid);
  }, []);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawGrid = async () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const avatarIndex = grid[row]?.[col];
          if (avatarIndex != null) {
            const img = new Image();
            img.src = AVATARS[avatarIndex];
            img.onload = () => {
              ctx.drawImage(
                img,
                col * TILE_SIZE,
                row * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
              );
            };
          }
        }
      }
    };

    if (grid.length) drawGrid();
  }, [grid]);

  const shareToX = () => {
    const text = encodeURIComponent(
      `🎉 Aku baru saja dapat skor ${score} di Prover Match Blast! Coba kamu juga yuk!`
    );
    const url = encodeURIComponent("https://proverhub.vercel.app");
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="match-blast-container">
      <h1>Prover Match Blast</h1>
      <p>Score: {score}</p>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * TILE_SIZE}
        height={GRID_SIZE * TILE_SIZE}
        style={{ border: "2px solid #ec4899", background: "#fdf6fb" }}
      />
      <button onClick={shareToX} className="share-button">
        🔗 Share to X
      </button>
    </div>
  );
}
