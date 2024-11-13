import { Sparkles, Wand2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageGeneratorProps {
  prompt: string;
  isGenerating: boolean;
  message: { text: string; type: string };
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
}

export function ImageGenerator({
  prompt,
  isGenerating,
  message,
  onPromptChange,
  onGenerate
}: ImageGeneratorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
    >
      <div className="relative mb-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isGenerating && onGenerate()}
          placeholder={window.navigator.language.startsWith('ar') ?
            "صف صورتك هنا..." :
            "Describe your image..."}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
        />
        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
      </div>

      <div className="relative">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 rounded-xl py-4 font-semibold text-white transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin text-cyan-400" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 text-cyan-400" />
              Generate
            </>
          )}
        </button>
        <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-semibold border border-cyan-500/30">
          Beta
        </span>
      </div>

      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl ${
            message.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
          }`}
        >
          {message.text}
        </motion.div>
      )}
    </motion.div>
  );
}