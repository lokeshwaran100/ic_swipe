import { motion } from 'framer-motion';
import { Sparkles, Skull, Star, Rocket, Brain, Wallet } from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import { NeuralHunt } from './NeuralHunt';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Login';
import { Navbar } from './Navbar';

const categories = [
  {
    id: 'meme-coins',
    name: 'Meme Coins',
    icon: Star,
    description: 'Popular and trending meme tokens on ICP',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'risky-degens',
    name: 'Risky Degens',
    icon: Skull,
    description: 'High risk, high reward tokens',
    color: 'from-red-400 to-pink-500',
  },
  {
    id: 'newly-launched',
    name: 'Newly Launched',
    icon: Rocket,
    description: 'Recently launched tokens on Internet Computer',
    color: 'from-green-400 to-emerald-500',
  },
  {
    id: 'blue-chips',
    name: 'Blue Chips',
    icon: Sparkles,
    description: 'Established and trusted ICP tokens',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'ai-analyzed',
    name: 'AI Analyzed',
    icon: Brain,
    description: 'AI-recommended tokens based on ICP data',
    color: 'from-purple-400 to-violet-500',
  },
];

export function CategoryPage() {
  const navigate = useNavigate();
  const auth = useAuth({});

  const handleCategoryClick = (categoryId) => {
    console.log('Navigating to category:', categoryId);
    navigate(`/swipe/${categoryId}?canisterId=be2us-64aaa-aaaaa-qaabq-cai`);
  };

  const handleNeuralHuntStart = (tokens, prompt) => {
    console.log('Starting AI Hunt with tokens:', tokens);
    navigate('/neural-hunt', { 
      state: { tokens, prompt }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      {/* Unified Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="min-h-screen pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Choose Your Path
            </h1>
            <p className="text-base md:text-xl text-gray-300">
              Select a category to start discovering tokens on the Internet Computer
            </p>
          </motion.div>

          {/* AI Hunt Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <NeuralHunt onStartTrading={handleNeuralHuntStart} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 1) * 0.1 }}
              >
                <CategoryCard
                  category={category}
                  onClick={() => handleCategoryClick(category.id)}
                />
              </motion.div>
            ))}
          </div>

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="p-6 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">
                🚀 Ready to Start Swiping?
              </h3>
              <p className="text-gray-400 text-sm md:text-base mb-4">
                Each category contains carefully curated tokens from the Internet Computer ecosystem. 
                Swipe right to invest, left to pass, and build your perfect ICP portfolio.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/portfolio?canisterId=be2us-64aaa-aaaaa-qaabq-cai"
                  className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200"
                >
                  View Your Portfolio
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Portfolio Button */}
      <Link
        to="/portfolio?canisterId=be2us-64aaa-aaaaa-qaabq-cai"
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-all duration-200 hover:scale-110"
        title="View Portfolio"
      >
        <Wallet className="w-6 h-6" />
      </Link>
    </div>
  );
} 