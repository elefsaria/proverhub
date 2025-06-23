import React from 'react';
import NFTGenerator from '../components/NFTGenerator';

export default function NFT() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-600 to-red-400 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">🎨 NFT Generator</h1>
      <NFTGenerator />
    </div>
  );
}
