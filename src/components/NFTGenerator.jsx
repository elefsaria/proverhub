import { useRef, useState } from "react";

export default function NFTGenerator({ onClose }) {
  const [image, setImage] = useState(null);
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setGenerated(false);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const generateNFT = () => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = 512;
    const height = 512;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Draw pink border
    ctx.fillStyle = "#ff69b4";
    ctx.fillRect(0, 0, width, height);

    // Draw image inside border
    const padding = 16;
    const imgWidth = width - padding * 2;
    const imgHeight = height - padding * 2;
    ctx.drawImage(image, padding, padding, imgWidth, imgHeight);

    // Add text
    ctx.font = "bold 30px sans-serif";
    ctx.fillStyle = "#ff69b4";
    ctx.textAlign = "center";
    ctx.fillText("PROVERHUB", width / 2, height - 20);

    setGenerated(true);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.download = "proverhub-nft.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const shareOnX = () => {
    const tweet = encodeURIComponent("Check out my NFT from #ProverHub 🔥");
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}&url=${url}`, "_blank");
  };

  return (
    <div className="nft-overlay">
      <div className="nft-modal">
        <button className="nft-close" onClick={onClose}>✖</button>

        <h2 className="nft-title">NFT Generator</h2>

        <input type="file" accept="image/*" onChange={handleImageUpload} className="nft-upload" />

        {image && (
          <>
            <canvas ref={canvasRef} className="nft-canvas" />
            <div className="nft-actions">
              <button onClick={generateNFT}>Generate NFT</button>
              {generated && (
                <>
                  <button onClick={downloadImage}>Download</button>
                  <button onClick={shareOnX}>Share to X</button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
