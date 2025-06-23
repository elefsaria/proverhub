import { useRef, useState } from "react";

export default function NFTGenerator({ onClose }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const canvasRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setGeneratedUrl(null); // Reset hasil jika upload baru
      };
      reader.readAsDataURL(file);
    }
  };

  const generateNFT = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const maxSize = 512;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw pink border background
      ctx.fillStyle = "#ec4899"; // Tailwind pink-500
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image inside pink border
      const border = 20;
      ctx.drawImage(
        img,
        border,
        border,
        canvas.width - 2 * border,
        canvas.height - 2 * border
      );

      // Draw text "PROVERHUB" at bottom
      ctx.fillStyle = "#fff";
      ctx.font = `${canvas.width / 10}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("PROVERHUB", canvas.width / 2, canvas.height - 30);

      const dataURL = canvas.toDataURL();
      setGeneratedUrl(dataURL);
    };

    img.src = imageSrc;
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.download = "proverhub-nft.png";
    link.href = generatedUrl;
    link.click();
  };

  const shareToX = () => {
    const text = encodeURIComponent("Saya baru saja membuat NFT dengan PROVERHUB!");
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-[400px] relative text-black">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-lg font-bold"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold text-center mb-4 text-pink-600">NFT Generator</h2>

        <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-3" />

        {imageSrc && !generatedUrl && (
          <button
            onClick={generateNFT}
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 mb-4"
          >
            🎨 Generate NFT
          </button>
        )}

        {generatedUrl && (
          <>
            <img
              src={generatedUrl}
              alt="NFT Result"
              className="mb-3 rounded border-4 border-pink-400 max-w-full"
            />
            <button
              onClick={downloadImage}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-2"
            >
              ⬇️ Download
            </button>
            <button
              onClick={shareToX}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              🔗 Share to X
            </button>
          </>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}
