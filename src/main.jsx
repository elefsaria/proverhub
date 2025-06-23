import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';

import Login from './pages/Login';
import Desktop from './pages/Desktop';
import QuickMath from './components/QuickMath';
import CatClicker from './components/CatClicker';
import FlappyBird from './components/FlappyBird';
import MiniMario from './components/MiniMario';
import Leaderboard from './pages/Leaderboard';
import NFT from './pages/NFT'; // ✅ Tambahkan ini

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/desktop" element={<Desktop />} />
        <Route path="/quickmath" element={<QuickMath />} />
        <Route path="/catclicker" element={<CatClicker />} />
        <Route path="/flappy" element={<FlappyBird />} />
        <Route path="/mario" element={<MiniMario />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/nft" element={<NFT />} /> {/* ✅ Ini untuk NFT Generator */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
