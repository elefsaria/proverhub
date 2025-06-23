import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const audioRef = useRef(null); // Ref untuk kontrol audio

  const handleLogin = () => {
    if (username.trim() !== "") {
      localStorage.setItem("username", username.trim());

      // Mainkan audio setelah interaksi
      if (audioRef.current) {
        audioRef.current.play().catch((e) => console.warn("Audio autoplay blocked:", e));
      }

      navigate("/desktop");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 🎬 Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔊 Audio: autoplay dikendalikan oleh interaksi user */}
      <audio ref={audioRef} loop>
        <source src="/login-audio.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* UI Login */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-4">
        <h1 className="text-4xl font-bold mb-6 animate-glow text-center">
          Welcome to Succinct OS
        </h1>

        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-md bg-white/90 text-black w-72 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <button
          onClick={handleLogin}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-md transition shadow-md"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
