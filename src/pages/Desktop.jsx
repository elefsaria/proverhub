import { useState, useEffect } from "react";
import QuickMath from "../games/QuickMath";
import CatClicker from "../games/CatClicker";
import flappyIcon from "../assets/flappy.png";
import catIcon from "../assets/cat.png";
import mathIcon from "../assets/math.png";
import logo from "/logo-energi.png"; // public folder

export default function Desktop({ username }) {
  const [activeGame, setActiveGame] = useState(null);
  const [logoVisible, setLogoVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="desktop">
      {/* Game Windows */}
      {activeGame === "math" && <QuickMath onClose={() => setActiveGame(null)} />}
      {activeGame === "cat" && <CatClicker onClose={() => setActiveGame(null)} />}

      {/* Desktop Icons */}
      <div className="desktop-icons">
        <div className="icon" onClick={() => setActiveGame("math")}>
          <img src={mathIcon} alt="QuickMath" />
          <span>QuickMath</span>
        </div>
        <div className="icon" onClick={() => setActiveGame("cat")}>
          <img src={catIcon} alt="CatClicker" />
          <span>CatClicker</span>
        </div>
      </div>

      {/* Central Logo */}
      {logoVisible && (
        <div className="center-logo">
          <img src={logo} alt="logo" className="glow-logo" />
        </div>
      )}

      {/* MacOS-style Dock */}
      <div className="dock">
        <div className="dock-icon">
          <img src={mathIcon} alt="QuickMath" onClick={() => setActiveGame("math")} />
        </div>
        <div className="dock-icon">
          <img src={catIcon} alt="CatClicker" onClick={() => setActiveGame("cat")} />
        </div>
      </div>

      {/* Footer Info */}
      <div className="footer">
        <span>👤 {username}</span>
        <a href="https://x.com/succinct" target="_blank" rel="noopener noreferrer">
          🧑‍💻 Profile X
        </a>
        <a href="https://discord.gg/succinct" target="_blank" rel="noopener noreferrer">
          💬 Join Discord
        </a>
      </div>
    </div>
  );
}
