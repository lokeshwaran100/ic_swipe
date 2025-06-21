import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, toast.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400 flex-shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 md:w-5 md:h-5 text-blue-400 flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 md:w-5 md:h-5 text-blue-400 flex-shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30';
      case 'error':
        return 'border-red-500/30';
      case 'info':
        return 'border-blue-500/30';
      default:
        return 'border-blue-500/30';
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20';
      case 'error':
        return 'bg-red-500/20';
      case 'info':
        return 'bg-blue-500/20';
      default:
        return 'bg-blue-500/20';
    }
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-4 left-4 right-4 md:top-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:max-w-md z-[60]"
        >
          <div className={`
            ${getBackgroundColor(toast.type)} 
            ${getBorderColor(toast.type)}
            backdrop-blur-lg border rounded-xl p-3 md:p-4 shadow-2xl
            flex items-start gap-2 md:gap-3 w-full
            relative overflow-hidden
          `}>
            {/* Background gradient for better visibility */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl" />
            
            {/* Content */}
            <div className="relative z-10 flex items-start gap-2 md:gap-3 w-full">
              {getIcon(toast.type)}
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <h4 className="font-semibold text-white text-xs md:text-sm mb-1 break-words">
                    {toast.title}
                  </h4>
                )}
                <p className="text-gray-200 text-xs md:text-sm leading-relaxed break-words">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg flex-shrink-0"
                aria-label="Close notification"
              >
                <X className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 