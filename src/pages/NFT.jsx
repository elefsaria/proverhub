import React from "react";
import NFTGenerator from "../components/NFTGenerator";

export default function NFT() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 text-white p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">🎨 NFT Generator</h1>
        <NFTGenerator />
      </div>
    </div>
  );
}
