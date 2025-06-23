// src/utils/storage.js

// Ambil data user dari localStorage
export const getUserData = () => {
  const data = localStorage.getItem('succinctUserData');
  return data ? JSON.parse(data) : null;
};

// Simpan data user ke localStorage
export const saveUserData = (data) => {
  localStorage.setItem('succinctUserData', JSON.stringify(data));
};

// Tambah skor untuk game tertentu
export const addScore = (gameName, score) => {
  const data = getUserData() || {
    username: localStorage.getItem('username') || 'Unknown',
    games: {}
  };

  if (!data.games[gameName]) {
    data.games[gameName] = { scores: [], bestScore: 0, roundsPlayed: 0 };
  }

  data.games[gameName].scores.push(score);
  data.games[gameName].roundsPlayed += 1;
  data.games[gameName].bestScore = Math.max(data.games[gameName].bestScore, score);

  saveUserData(data);
};

// Dapatkan skor dari game tertentu
export const getGameData = (gameName) => {
  const data = getUserData();
  return data?.games?.[gameName] || null;
};
