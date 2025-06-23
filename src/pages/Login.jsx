import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (username.trim() !== "") {
      localStorage.setItem("username", username);
      navigate("/desktop");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 🔁 Video background */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🎨 Overlay untuk membuat teks lebih terbaca */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* 🌟 Content Login */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white">
        <h1 className="text-4xl font-bold mb-6 animate-glow">Welcome to Succinct OS</h1>

        <input
          type="text"
          placeholder="Enter your X/Discord username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded bg-white text-black mb-4"
        />

        <button
          onClick={handleLogin}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
