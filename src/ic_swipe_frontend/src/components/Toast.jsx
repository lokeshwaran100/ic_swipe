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
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-500/20';
      case 'error':
        return 'border-red-500/20';
      case 'info':
        return 'border-blue-500/20';
      default:
        return 'border-blue-500/20';
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10';
      case 'error':
        return 'bg-red-500/10';
      case 'info':
        return 'bg-blue-500/10';
      default:
        return 'bg-blue-500/10';
    }
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md mx-4"
        >
          <div className={`
            ${getBackgroundColor(toast.type)} 
            ${getBorderColor(toast.type)}
            backdrop-blur-lg border rounded-xl p-4 shadow-xl
            flex items-center gap-3 min-w-[300px]
          `}>
            {getIcon(toast.type)}
            <div className="flex-1">
              {toast.title && (
                <h4 className="font-semibold text-white text-sm mb-1">
                  {toast.title}
                </h4>
              )}
              <p className="text-gray-300 text-sm">
                {toast.message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 