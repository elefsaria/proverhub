import { useState } from "react";

export default function CatClicker({ onClose }) {
  const [score, setScore] = useState(0);

  const shareToX = () => {
    const url = encodeURIComponent("https://provehub.vercel.app"); // ganti dengan link kamu
    const text = encodeURIComponent(
      `I just scored ${score} in Cat Clicker on Succinct OS! 🐱🔥\nTry it here:`
    );
    const xLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(xLink, "_blank");
  };

  return (
    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[300px] h-[370px] bg-white/90 border border-gray-400 rounded-lg shadow-lg p-4 text-center z-50">
      <h2 className="text-xl font-bold mb-3">🐱 Cat Clicker</h2>
      <p className="mb-2 text-sm text-gray-700">Click the cat as fast as you can!</p>

      <button
        onClick={() => setScore(score + 1)}
        className="focus:outline-none active:scale-95 transition"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/2203/2203187.png"
          alt="Cat"
          className="w-24 h-24 mx-auto"
        />
      </button>

      <p className="mt-2 text-lg font-mono">Score: {score}</p>

      {/* Share to X */}
      <button
        onClick={shareToX}
        className="mt-4 bg-black text-white text-xs px-4 py-2 rounded hover:bg-gray-800"
      >
        Share to X
      </button>

      <button
        onClick={onClose}
        className="mt-2 text-xs text-gray-600 underline hover:text-black block mx-auto"
      >
        Close Game
      </button>
    </div>
  );
}
