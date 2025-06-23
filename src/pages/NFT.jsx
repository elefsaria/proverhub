import html2canvas from "html2canvas";
import { useRef } from "react";

export default function NFT({ image }) {
  const resultRef = useRef(null);

  const handleDownload = () => {
    if (resultRef.current) {
      html2canvas(resultRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = "nft.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const handleShare = () => {
    if (resultRef.current) {
      html2canvas(resultRef.current).then((canvas) => {
        const dataUrl = canvas.toDataURL();
        const blob = dataURLToBlob(dataUrl);
        const file = new File([blob], "nft.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: "My NFT",
            text: "Check out my custom NFT!",
          });
        } else {
          alert("Sharing not supported on this browser.");
        }
      });
    }
  };

  const dataURLToBlob = (dataURL) => {
    const parts = dataURL.split(",");
    const byteString = atob(parts[1]);
    const mimeString = parts[0].match(/:(.*?);/)[1];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  if (!image) return null;

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <div
        ref={resultRef}
        className="relative border-4 border-pink-500 rounded overflow-hidden w-full max-w-sm"
      >
        <img src={image} alt="NFT" className="w-full object-contain" />
        <div className="absolute bottom-2 right-2 bg-pink-500 text-white px-2 py-1 rounded text-xs font-bold">
          PROVERHUB
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleDownload}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Download
        </button>
        <button
          onClick={handleShare}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Share to X
        </button>
      </div>
    </div>
  );
}
