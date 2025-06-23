import React from 'react';
import NFTGenerator from '../components/NFTGenerator';

export default function NFT() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4">
      <NFTGenerator />
    </div>
  );
}
