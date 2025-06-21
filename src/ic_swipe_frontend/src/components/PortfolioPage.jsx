import { useState } from "react";
import { motion } from "framer-motion";
import { PortfolioCard } from "./PortfolioCard";
import { Menu, Home } from "lucide-react";
import { Link } from 'react-router-dom';

// Mock portfolio data for demonstration
const mockPortfolioTokens = [
  {
    address: "0x1234567890123456789012345678901234567890",
    name: "Internet Computer",
    symbol: "ICP",
    price: 12.45,
    priceChange: 5.67,
    image: "/ICSwipe.png", // Using the IcSwipe logo as placeholder
    amount: "25.5",
    value: (25.5 * 12.45).toString()
  },
  {
    address: "0x0987654321098765432109876543210987654321",
    name: "Bitcoin",
    symbol: "BTC",
    price: 43250.75,
    priceChange: -2.34,
    image: null,
    amount: "0.15",
    value: (0.15 * 43250.75).toString()
  },
  {
    address: "0x1111222233334444555566667777888899990000",
    name: "Ethereum",
    symbol: "ETH",
    price: 2650.25,
    priceChange: 8.92,
    image: null,
    amount: "2.5",
    value: (2.5 * 2650.25).toString()
  }
];

export function PortfolioPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [defaultAmount, setDefaultAmount] = useState("100");
  const [inputValue, setInputValue] = useState(defaultAmount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-6 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/ICSwipe.png" 
              alt="IcSwipe Logo" 
              className="w-8 h-8 md:w-10 md:h-10"
            />
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              IcSwipe
            </span>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white transition"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 items-center">
            <Link 
              to="/"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link 
              to="/categories?canisterId=be2us-64aaa-aaaaa-qaabq-cai"
              className="text-gray-300 hover:text-white transition"
            >
              Categories
            </Link>
            <button className="text-gray-300 hover:text-white transition">Settings</button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-lg md:hidden border-b border-white/10"
          >
            <div className="flex flex-col p-4 gap-4">
              <Link 
                to="/"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition text-left"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link 
                to="/categories?canisterId=be2us-64aaa-aaaaa-qaabq-cai"
                className="text-gray-300 hover:text-white transition text-left"
              >
                Categories
              </Link>
              <button className="text-gray-300 hover:text-white transition text-left">Settings</button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="min-h-screen pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Your Portfolio
              </h1>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Default Amount:</span>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-24 p-2 text-sm rounded-lg bg-black/30 border border-white/10 focus:border-blue-500 outline-none transition text-white"
                    step="0.01"
                    placeholder="100"
                  />
                  <button
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white hover:opacity-90 transition text-sm font-medium"
                    onClick={() => setDefaultAmount(inputValue)}
                  >
                    Set Default
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {mockPortfolioTokens.map((token, index) => (
                <motion.div
                  key={token.address}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PortfolioCard token={token} />
                </motion.div>
              ))}
            </div>

            {/* Portfolio Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Portfolio Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Total Value</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    ${mockPortfolioTokens.reduce((sum, token) => sum + parseFloat(token.value), 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Total Tokens</p>
                  <p className="text-2xl font-bold text-white">
                    {mockPortfolioTokens.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Default Amount</p>
                  <p className="text-2xl font-bold text-purple-400">
                    ${defaultAmount}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  🚀 Ready to Discover More?
                </h3>
                <p className="text-gray-400 text-sm md:text-base mb-4">
                  Explore new tokens and expand your portfolio on the Internet Computer ecosystem.
                </p>
                <Link
                  to="/categories?canisterId=be2us-64aaa-aaaaa-qaabq-cai"
                  className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200"
                >
                  Browse Categories
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 