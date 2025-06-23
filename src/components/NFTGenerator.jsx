import React, { useState } from "react";

export default function NFTGenerator() {
  const [image, setImage] = useState(null);
  const [generated, setGenerated] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setGenerated(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateNFT = () => {
    if (!image) return;
    setGenerated(image);
  };

  const downloadNFT = () => {
    const a = document.createElement("a");
    a.href = document.getElementById("nft-image").toDataURL("image/png");
    a.download = "proverhub-nft.png";
    a.click();
  };

  const shareToX = () => {
    const tweet = encodeURIComponent("I just minted a custom NFT with ProverHub!");
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, "_blank");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept="image/*" onChange={handleUpload} />
      <button
        onClick={generateNFT}
        className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded"
      >
        Generate NFT
      </button>

      {generated && (
        <div className="relative">
          <canvas
            id="nft-image"
            width={300}
            height={300}
            style={{ display: "none" }}
          />
          <div className="border-4 border-pink-500 p-2 rounded-md relative">
            <img
              src={generated}
              alt="NFT Preview"
              className="w-72 h-72 object-cover rounded"
              onLoad={() => {
                const canvas = document.getElementById("nft-image");
                const ctx = canvas.getContext("2d");
                const img = new Image();
                img.src = generated;
                img.onload = () => {
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  ctx.drawImage(img, 0, 0, 300, 300);
                  ctx.font = "bold 20px sans-serif";
                  ctx.fillStyle = "#ff69b4";
                  ctx.textAlign = "center";
                  ctx.fillText("PROVERHUB", 150, 290);
                };
              }}
            />
            <div className="absolute bottom-1 left-0 right-0 text-center text-pink-500 font-bold">
              PROVERHUB
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={downloadNFT}
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Download
            </button>
            <button
              onClick={shareToX}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Share to X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
