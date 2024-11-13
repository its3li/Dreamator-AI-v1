import { HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function HelpTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-4 top-4 z-50">
      <button
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <HelpCircle className="w-6 h-6 text-cyan-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-12 top-0 w-80 bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 shadow-xl"
          >
            {/* English Instructions */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">How to Use</h3>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Enter image description</li>
                <li>Click Generate or press Enter</li>
                <li>Wait for generation</li>
                <li>Download or share your image</li>
              </ol>
              <p>Made by ali 👌ㅤ</p>
            </div>

            {/* Arabic Instructions */}
            <div className="font-arabic" dir="rtl">
              <h3 className="text-lg font-semibold text-white mb-2">كيفية الاستخدام</h3>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>أدخل وصف الصورة</li>
                <li>انقر على (Generate) أو اضغط Enter</li>
                <li>انتظر عملية الإنشاء</li>
                <li>حمّل أو شارك صورتك</li>
              </ol>
              <p>  من صنع علي 😁ㅤ</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}