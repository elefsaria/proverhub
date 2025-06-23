import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';

import Login from './pages/Login';
import Desktop from './pages/Desktop';
import QuickMath from './games/QuickMath';
import CatClicker from './games/CatClicker';
import FlappyBird from './games/FlappyBird';
import MiniMario from './games/MiniMario';
import Leaderboard from './pages/Leaderboard';

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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
