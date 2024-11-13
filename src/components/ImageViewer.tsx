import { Download, Link, Share2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ImageViewerProps {
  imageUrl: string;
  isModalOpen: boolean;
  onModalClose: () => void;
  onCopyLink: () => void;
  onShare: () => void;
  prompt: string;
  onDownload: () => Promise<void>;
}

export function ImageViewer({
  imageUrl,
  isModalOpen,
  onModalClose,
  onCopyLink,
  onShare,
}: ImageViewerProps) {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  if (!imageUrl) return null;

  // Function to handle download with custom filename
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;

      // Generate a random filename
      const randomString = Math.random().toString(36).substring(2, 15);
      const filename = `${randomString}.png`;

      // Set the download attribute with the random filename
      link.setAttribute('download', filename);

      // Append the link to the body, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the Blob URL after download
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setIsLinkCopied(true);
      setTimeout(() => {
        setIsLinkCopied(false);
      }, 1000);
      onCopyLink();
    } catch {
      // Handle error if needed
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        <div
          onClick={() => onModalClose()}
          className="relative group cursor-pointer overflow-hidden rounded-2xl w-96 h-96 mx-auto"
        >
          <img
            src={imageUrl}
            alt="Generated artwork"
            className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-white text-sm font-medium">Click to view</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 p-4 flex items-center justify-center"
            onClick={onModalClose}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full mx-auto relative font-sans"
            >
              <button
                onClick={onModalClose}
                className="absolute -top-4 -right-4 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full"
              >
                <X className="text-cyan-400" />
              </button>
              <div className="flex justify-center items-center mb-6">
                <img
                  src={imageUrl}
                  alt="Generated artwork"
                  className="max-w-full max-h-[75vh] object-contain rounded-lg"
                />
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
              <button
      onClick={handleDownload} // Ensure this line is present
      className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl transition-colors"
    >
      <Download className="text-cyan-400" /> Download
    </button>
                <button
                  onClick={handleCopyLink} // Updated to handleCopyLink
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-700 hover:bg-cyan-600 rounded-xl transition-colors"
                >
                  {isLinkCopied ? <Check className="text-cyan-400" /> : <Link className="text-cyan-400" />}
                  {isLinkCopied ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={onShare}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-700 hover:bg-cyan-600 rounded-xl transition-colors"
                >
                  <Share2 className="text-cyan-400" /> Share
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
