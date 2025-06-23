import { useState } from "react";
import NFT from "../pages/NFT";

export default function NFTGenerator({ onClose }) {
  const [image, setImage] = useState(null);
  const [showNFT, setShowNFT] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setShowNFT(false); // Reset dulu
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (image) setShowNFT(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 overflow-auto">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        >
          ×
        </button>
        <h2 className="text-center text-pink-600 font-bold text-lg mb-4">
          NFT Generator
        </h2>

        {!image && (
          <div className="text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mx-auto mb-4"
            />
          </div>
        )}

        {image && !showNFT && (
          <div className="flex flex-col items-center gap-3">
            <img
              src={image}
              alt="Preview"
              className="max-h-[300px] w-auto border rounded mb-3"
            />
            <button
              onClick={handleGenerate}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
            >
              Generate NFT
            </button>
          </div>
        )}

        {showNFT && image && (
          <NFT image={image} />
        )}
      </div>
    </div>
  );
}
