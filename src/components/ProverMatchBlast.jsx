import { useState, useEffect } from "react";
import "./../styles/matchBlast.css";

const numRows = 8;
const numCols = 8;
const avatars = [1, 2, 3, 4, 5];

const getRandomAvatar = () =>
  `/assets/match-blast/avatar${Math.ceil(Math.random() * avatars.length)}.png`;

const ProverMatchBlast = ({ onClose }) => {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [audio] = useState(() => new Audio("/assets/match-blast/pop.mp3"));

  useEffect(() => {
    initGrid();
  }, []);

  const initGrid = () => {
    const newGrid = Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => getRandomAvatar())
    );
    setGrid(newGrid);
  };

  const detectMatches = (g) => {
    const matched = Array.from({ length: numRows }, () =>
      Array(numCols).fill(false)
    );

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols - 2; c++) {
        if (g[r][c] && g[r][c] === g[r][c + 1] && g[r][c] === g[r][c + 2]) {
          matched[r][c] = matched[r][c + 1] = matched[r][c + 2] = true;
        }
      }
    }

    for (let c = 0; c < numCols; c++) {
      for (let r = 0; r < numRows - 2; r++) {
        if (g[r][c] && g[r][c] === g[r + 1][c] && g[r][c] === g[r + 2][c]) {
          matched[r][c] = matched[r + 1][c] = matched[r + 2][c] = true;
        }
      }
    }

    return matched;
  };

  const collapseGrid = (g, matched) => {
    let newGrid = [...g].map((row) => [...row]);
    for (let c = 0; c < numCols; c++) {
      let stack = [];
      for (let r = numRows - 1; r >= 0; r--) {
        if (!matched[r][c]) stack.push(newGrid[r][c]);
      }

      for (let r = numRows - 1; r >= 0; r--) {
        newGrid[r][c] = stack[numRows - 1 - r] || getRandomAvatar();
      }
    }
    return newGrid;
  };

  const handleTileClick = () => {
    const matches = detectMatches(grid);
    const hasMatch = matches.flat().some((x) => x);

    if (hasMatch) {
      audio.play();
      const newGrid = collapseGrid(grid, matches);
      const comboScore = matches.flat().filter(Boolean).length * 10;
      const newScore = score + comboScore;

      setScore(newScore);
      setLevel(1 + Math.floor(newScore / 300));
      setGrid(newGrid);
    }
  };

  const shareToX = () => {
    const text = encodeURIComponent(`🎮 Saya main Prover Match Blast dan skor saya ${score}! 💥 Coba kamu juga!`);
    const url = encodeURIComponent("https://proverhub.vercel.app");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  return (
    <div className="matchblast-overlay">
      <div className="matchblast-container">
        <button onClick={onClose} className="matchblast-close">❌</button>
        <h2 className="matchblast-title">Prover Match Blast</h2>
        <div className="matchblast-info">
          <span>Score: {score}</span>
          <span>Level: {level}</span>
        </div>
        <div className="matchblast-grid">
          {grid.map((row, rIdx) =>
            row.map((img, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className="matchblast-tile"
                onClick={handleTileClick}
              >
                <img src={img} alt="avatar" />
              </div>
            ))
          )}
        </div>
        <div className="matchblast-actions">
          <button onClick={shareToX} className="matchblast-btn">🔗 Share ke X</button>
          <button onClick={initGrid} className="matchblast-btn">🔄 Ulangi</button>
        </div>
      </div>
    </div>
  );
};

export default ProverMatchBlast;
