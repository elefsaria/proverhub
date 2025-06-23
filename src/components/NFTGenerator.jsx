import { useState } from "react";
import NFT from "./NFT";

export default function NFTGenerator() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showNFT, setShowNFT] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setShowNFT(false);
  };

  const handleGenerate = () => {
    if (selectedFile) {
      setShowNFT(true);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setShowNFT(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 text-center w-[90%] max-w-md overflow-auto max-h-screen relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-pink-500 mb-4">NFT Generator</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />

        {preview && (
          <div className="overflow-y-auto max-h-[60vh] mb-4">
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg mx-auto object-contain"
            />
          </div>
        )}

        {!showNFT && preview && (
          <button
            onClick={handleGenerate}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded shadow"
          >
            Generate NFT
          </button>
        )}

        {showNFT && <NFT image={preview} />}
      </div>
    </div>
  );
}
