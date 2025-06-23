import React, { useEffect, useState } from "react";
import { getUserData } from "../utils/storage";

const generateMockLeaderboard = () => {
  // Simulasi 75 user dengan skor acak
  const users = [];
  for (let i = 1; i <= 75; i++) {
    users.push({
      username: `player${i}`,
      score: Math.floor(Math.random() * 500),
      date: new Date(Date.now() - Math.random() * 7 * 86400000), // acak 7 hari ke belakang
    });
  }

  const currentUser = getUserData();
  if (currentUser) {
    const myScore = currentUser.games?.QuickMath?.bestScore || 0;
    users.push({
      username: currentUser.username,
      score: myScore,
      date: new Date(),
    });
  }

  return users;
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [view, setView] = useState("daily");

  useEffect(() => {
    const all = generateMockLeaderboard();
    const now = new Date();
    const filtered =
      view === "daily"
        ? all.filter((u) => {
            const diff = Math.abs(now - new Date(u.date));
            return diff < 24 * 60 * 60 * 1000;
          })
        : all;
    const sorted = filtered.sort((a, b) => b.score - a.score);
    setLeaderboard(sorted);
  }, [view]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">🏆 Leaderboard {view}</h1>
      <div className="mb-4 space-x-2">
        <button onClick={() => setView("daily")} className="px-4 py-2 bg-pink-600 rounded hover:bg-pink-700">Daily</button>
        <button onClick={() => setView("weekly")} className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700">Weekly</button>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="pb-2">Rank</th>
            <th className="pb-2">Username</th>
            <th className="pb-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.slice(0, 50).map((user, idx) => (
            <tr key={idx} className={idx === 0 ? "font-bold text-yellow-400" : ""}>
              <td>{idx + 1}</td>
              <td>{user.username}</td>
              <td>{user.score}</td>
            </tr>
          ))}
          {leaderboard.length > 50 && (
            <>
              <tr>
                <td colSpan="3" className="text-center text-gray-400 py-2">...</td>
              </tr>
              <tr className="bg-gray-800 text-pink-400">
                <td>
                  {leaderboard.findIndex(
                    (u) => u.username === getUserData()?.username
                  ) + 1}
                </td>
                <td>{getUserData()?.username}</td>
                <td>
                  {getUserData()?.games?.QuickMath?.bestScore || 0}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
