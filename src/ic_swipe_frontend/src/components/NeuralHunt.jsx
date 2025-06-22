import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Zap, Search, ArrowRight } from 'lucide-react';
import { AIService } from '../services/aiService';

export function NeuralHunt({ onStartTrading }) {
  const [isHovered, setIsHovered] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => setShowInput(true), 300);
  };

  const handleMouseLeave = () => {
    if (!prompt && !isLoading) {
      setIsHovered(false);
      setShowInput(false);
    }
  };

  const handleStartTrading = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const tokens = await AIService.generateTokens(prompt);
      onStartTrading(tokens, prompt);
    } catch (error) {
      console.error('Failed to generate tokens:', error);
      // Still call onStartTrading with fallback tokens
      const fallbackTokens = AIService.getFallbackTokens(prompt);
      onStartTrading(fallbackTokens, prompt);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleStartTrading();
    }
  };

  const suggestedPrompts = [
    "Show me AI and machine learning tokens",
    "Find gaming and metaverse projects",
    "I want DeFi tokens with high yield potential",
    "Show me meme coins with strong communities",
    "Find eco-friendly and sustainable crypto projects"
  ];

  return (
    <div className="relative">
      {/* Main AI Hunt Card */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-blue-900/80 backdrop-blur-lg border border-white/10 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="w-8 h-8 text-cyan-400" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Hunt</h2>
                <p className="text-cyan-300 text-sm">AI-Powered Token Discovery</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <Zap className="w-5 h-5 text-blue-400 animate-bounce" />
            </div>
          </div>

          {/* Hover State Content */}
          <AnimatePresence>
            {!showInput ? (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ 
                    rotateY: isHovered ? 360 : 0,
                    scale: isHovered ? 1.1 : 1 
                  }}
                  transition={{ duration: 0.6 }}
                  className="mb-4"
                >
                  <Search className="w-16 h-16 text-cyan-400 mx-auto" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Discover Tokens with AI
                </h3>
                <p className="text-gray-300 text-sm">
                  Hover to reveal the AI Hunt interface
                </p>
                <div className="mt-4 flex justify-center">
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-cyan-400"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Input Field */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe the tokens you're looking for..."
                    className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Brain className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>

                {/* Suggested Prompts */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-medium">Try these prompts:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(suggestion)}
                        className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-cyan-300 rounded-lg transition-all duration-200 border border-cyan-400/20 hover:border-cyan-400/40"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Trading Button */}
                <motion.button
                  onClick={handleStartTrading}
                  disabled={!prompt.trim() || isLoading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: prompt.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: prompt.trim() ? 0.98 : 1 }}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Generating AI Hunt...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Start AI Hunt
                    </>
                  )}
                </motion.button>

                {/* Info Text */}
                <p className="text-xs text-gray-400 text-center">
                  AI will generate personalized token recommendations based on your prompt
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
} 