import { motion } from 'framer-motion';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageViewer } from './components/ImageViewer';
import { generateImage } from './services/imageService';
import { ImageGenerationError } from './utils/errors';
import { useCallback } from 'react';
import { useState } from 'react';
import { HelpTooltip } from './components/HelpTooltip';

function App() {
  const [prompt, setPrompt] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [lastPrompt, setLastPrompt] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setMessage({ text: 'Please enter a description for your image', type: 'error' });
      return;
    }

    if (prompt.trim() === lastPrompt.trim()) {
      setMessage({ text: 'Please modify your prompt for a different result', type: 'error' });
      return;
    }

    setIsGenerating(true);
    setMessage({ text: '', type: '' });

    try {
      const result = await generateImage(prompt);
      setCurrentImageUrl(result.url);
      setLastPrompt(prompt.trim());
    } catch (error) {
      if (error instanceof ImageGenerationError) {
        setMessage({ text: error.message, type: 'error' });
      } else {
        setMessage({ text: 'An unexpected error occurred', type: 'error' });
      }
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, lastPrompt]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentImageUrl);
      setMessage({ text: 'Link copied to clipboard!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to copy link', type: 'error' });
    }
  };
  const handleDownload = async () => {
    try {
      const response = await fetch(currentImageUrl);
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
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My AI Generated Image',
          text: 'Check out this image I created with Dreamator AI!',
          url: currentImageUrl
        });
      } catch (error) {
        const err = error as Error;
        if (err.name !== 'AbortError') {
          setMessage({ text: 'Failed to share image', type: 'error' });
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 text-white relative overflow-hidden">
      <div className="fixed left-4 top-4 z-50">
        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-semibold border border-cyan-500/30">
          Beta
        </span>
      </div>

      <HelpTooltip />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-cyan-500/30 rounded-full blur-3xl -top-48 -right-48 animate-pulse"></div>
        <div className="absolute w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl -bottom-48 -left-48 animate-pulse delay-1000"></div>
        <div className="absolute w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-white font-handwriting">
            Dreamator <span className="text-5xl font-sans">AI</span>
          </h1>
          <p className="text-xl text-gray-300">Transform your imagination into reality</p>
          <p className="text-xl text-gray-300 font-arabic">حوّل خيالك إلى واقع</p>
        </motion.div>

        <ImageGenerator
          prompt={prompt}
          isGenerating={isGenerating}
          message={message}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
        />

        <ImageViewer
          imageUrl={currentImageUrl}
          prompt={prompt}
          isModalOpen={isModalOpen}
          onModalClose={() => setIsModalOpen(!isModalOpen)}
          onCopyLink={handleCopyLink}
          onShare={handleShare}
          onDownload={handleDownload}
        />
      </div>

      <footer className="text-center text-gray-400 mt-8 font-arabic">
        <p>💻 Built with ❤ by Ali Mahmoud using <span className="font-semibold">React</span>, <span className="font-semibold">Vite</span>, <span className="font-semibold">Tailwind CSS</span>, and <span className="font-semibold">Pollinations API</span>.</p>
        <p>All rights reserved. © 2024 Dreamator AI</p>
      </footer>
    </div>
  );
}

export default App;
