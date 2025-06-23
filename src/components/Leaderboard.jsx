import { useEffect, useState } from "react";

export default function Leaderboard({ game, onClose }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(`${game}_scores`);
    if (raw) {
      const parsed = JSON.parse(raw);
      const top = parsed.sort((a, b) => b.score - a.score).slice(0, 5);
      setScores(top);
    }
  }, [game]);

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[300px] bg-white text-black rounded-xl shadow-lg p-4 z-50">
      <h2 className="text-xl font-bold mb-2 text-center">🏆 Leaderboard: {game}</h2>
      {scores.length > 0 ? (
        <ul className="space-y-2">
          {scores.map((entry, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>#{i + 1} - {entry.username}</span>
              <span className="font-mono">{entry.score}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-sm text-gray-500">Belum ada skor.</p>
      )}

      <button
        onClick={onClose}
        className="mt-4 text-xs text-blue-600 hover:underline block mx-auto"
      >
        Close
      </button>
    </div>
  );
}
