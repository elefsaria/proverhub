import { useRef, useState } from "react";

export default function NFTGenerator() {
  const [image, setImage] = useState(null);
  const canvasRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const drawNFT = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;

      // Background + border
      ctx.fillStyle = "#ff69b4"; // pink
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw uploaded image in center
      const margin = 20;
      ctx.drawImage(
        img,
        margin,
        margin,
        canvas.width - margin * 2,
        canvas.height - margin * 2 - 40
      );

      // Text
      ctx.fillStyle = "white";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PROVERHUB", canvas.width / 2, canvas.height - 20);
    };
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = "proverhub-nft.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const handleShare = () => {
    const tweetText = encodeURIComponent("Check out my #ProverHub NFT!");
    const tweetUrl = "https://twitter.com/intent/tweet?text=" + tweetText;
    window.open(tweetUrl, "_blank");
  };

  return (
    <div className="text-white flex flex-col items-center gap-4 p-6">
      <h2 className="text-xl font-bold">🎨 NFT Generator</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="text-white"
      />

      {image && (
        <>
          <canvas ref={canvasRef} className="border border-pink-400" />
          <div className="flex gap-4 mt-2">
            <button
              onClick={drawNFT}
              className="bg-pink-600 px-4 py-2 rounded hover:bg-pink-700"
            >
              Generate
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              Download
            </button>
            <button
              onClick={handleShare}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Share to X
            </button>
          </div>
        </>
      )}
    </div>
  );
}
