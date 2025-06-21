import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import { TokenCard } from "./TokenCard";
import { Toast } from "./Toast";

// Mock token data for different categories
const getMockTokens = (category) => {
  const baseTokens = [
    {
      id: 1,
      name: "Dogecoin",
      symbol: "DOGE",
      price: 0.072345,
      priceChange: { h24: "5.67" },
      marketCap: 10500000000,
      liquidity: { usd: 45000000 },
      fdv: 10600000000,
      image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: 1640995200,
      baseToken: {
        name: "Dogecoin",
        symbol: "DOGE"
      }
    },
    {
      id: 2,
      name: "Shiba Inu",
      symbol: "SHIB",
      price: 0.000008234,
      priceChange: { h24: "-2.34" },
      marketCap: 4800000000,
      liquidity: { usd: 28000000 },
      fdv: 4850000000,
      image: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: 1629936000,
      baseToken: {
        name: "Shiba Inu",
        symbol: "SHIB"
      }
    },
    {
      id: 3,
      name: "Pepe",
      symbol: "PEPE",
      price: 0.00000123,
      priceChange: { h24: "12.45" },
      marketCap: 520000000,
      liquidity: { usd: 15000000 },
      fdv: 520000000,
      image: "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: 1681776000,
      baseToken: {
        name: "Pepe",
        symbol: "PEPE"
      }
    },
    {
      id: 4,
      name: "Floki Inu",
      symbol: "FLOKI",
      price: 0.00003456,
      priceChange: { h24: "8.92" },
      marketCap: 330000000,
      liquidity: { usd: 12000000 },
      fdv: 340000000,
      image: "https://cryptologos.cc/logos/floki-inu-floki-logo.png",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: 1625097600,
      baseToken: {
        name: "Floki Inu",
        symbol: "FLOKI"
      }
    },
    {
      id: 5,
      name: "Baby Doge Coin",
      symbol: "BABYDOGE",
      price: 0.0000000023,
      priceChange: { h24: "-1.23" },
      marketCap: 160000000,
      liquidity: { usd: 8000000 },
      fdv: 165000000,
      image: "https://assets.coingecko.com/coins/images/16125/large/babydoge.jpg",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: 1623456000,
      baseToken: {
        name: "Baby Doge Coin",
        symbol: "BABYDOGE"
      }
    }
  ];

  // Customize tokens based on category
  switch (category) {
    case 'meme-coins':
      return baseTokens;
    case 'risky-degens':
      return baseTokens.map(token => ({
        ...token,
        priceChange: { h24: (Math.random() * 200 - 100).toFixed(2) }, // More volatile
        liquidity: { usd: token.liquidity.usd * 0.3 } // Lower liquidity
      }));
    case 'newly-launched':
      return baseTokens.map(token => ({
        ...token,
        pairCreatedAt: Date.now() / 1000 - Math.random() * 86400 * 7, // Within last week
        marketCap: token.marketCap * 0.1 // Smaller market cap
      }));
    case 'blue-chips':
      return [
        {
          ...baseTokens[0],
          name: "Bitcoin",
          symbol: "BTC",
          price: 43250.67,
          marketCap: 850000000000,
          liquidity: { usd: 2000000000 }
        },
        {
          ...baseTokens[1],
          name: "Ethereum",
          symbol: "ETH",
          price: 2650.43,
          marketCap: 320000000000,
          liquidity: { usd: 1500000000 }
        }
      ];
    case 'ai-analyzed':
      return baseTokens.map(token => ({
        ...token,
        aiScore: Math.floor(Math.random() * 40) + 60 // AI score 60-100
      }));
    default:
      return baseTokens;
  }
};

export function SwipePage() {
  const navigate = useNavigate();
  const { category } = useParams();
  const [tokens, setTokens] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trustScore, setTrustScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const controls = useAnimation();

  // Initialize tokens and trust score
  useEffect(() => {
    const mockTokens = getMockTokens(category);
    setTokens(mockTokens);
    setTrustScore(Math.floor(Math.random() * 60) + 40); // Random trust score 40-100
    setLoading(false);
  }, [category]);

  // Close toast function
  const closeToast = () => {
    setToast(null);
  };

  const currentToken = tokens[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#001F3F] via-[#1A1A2E] to-[#2D1B3D] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-transparent animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading tokens...</p>
        </div>
      </div>
    );
  }

  if (!tokens.length) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#001F3F] via-[#1A1A2E] to-[#2D1B3D] flex items-center justify-center">
        <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center max-w-md mx-4">
          <p className="text-gray-400">No tokens found in this category</p>
        </div>
      </div>
    );
  }

  if (!currentToken) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#001F3F] via-[#1A1A2E] to-[#2D1B3D] flex items-center justify-center">
        <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center max-w-md mx-4">
          <p className="text-gray-400">No more tokens to swipe!</p>
          <button
            onClick={() => navigate('/categories?canisterId=be2us-64aaa-aaaaa-qaabq-cai')}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg text-white font-medium hover:opacity-90 transition"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  const handleBuy = async () => {
    console.log('Buying token:', currentToken);
    
    // Show success toast
    setToast({
      type: 'success',
      title: 'Token Added! 🚀',
      message: `${currentToken.baseToken?.name || currentToken.name} added to your portfolio`,
      duration: 3000
    });
    
    // TODO: Add to portfolio logic will be added later
    
    // Move to next token
    if (currentIndex < tokens.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTrustScore(Math.floor(Math.random() * 60) + 40); // New random trust score
    }
  };

  const handleSkip = async () => {
    console.log('Skipping token:', currentToken);
    
    // Show info toast
    setToast({
      type: 'info',
      title: 'Token Skipped 👍',
      message: `Passed on ${currentToken.baseToken?.name || currentToken.name}`,
      duration: 2000
    });
    
    // Move to next token
    if (currentIndex < tokens.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTrustScore(Math.floor(Math.random() * 60) + 40); // New random trust score
    }
  };

  const handleDragEnd = async (event, info) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        await controls.start({ x: 500, opacity: 0 });
        await handleBuy();
      } else {
        await controls.start({ x: -500, opacity: 0 });
        await handleSkip();
      }
      controls.set({ x: 0, opacity: 1 });
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'meme-coins': return 'Meme Coins';
      case 'risky-degens': return 'Risky Degens';
      case 'newly-launched': return 'Newly Launched';
      case 'blue-chips': return 'Blue Chips';
      case 'ai-analyzed': return 'AI Analyzed';
      default: return 'Tokens';
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#001F3F] via-[#1A1A2E] to-[#2D1B3D] relative">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-6 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              IcSwipe - {getCategoryTitle(category)}
            </span>
          </div>

          <div className="flex gap-4">
            <ThumbsDown className="w-6 h-6 text-red-400 animate-pulse" />
            <ThumbsUp className="w-6 h-6 text-green-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {/* <div className="fixed top-20 left-0 right-0 z-40 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black/20 backdrop-blur-lg rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / tokens.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-gray-400 text-sm mt-2">
            {currentIndex + 1} of {tokens.length}
          </p>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="min-h-screen pt-32 pb-12 px-4 md:px-6 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            className="touch-none flex justify-center relative"
          >
            {/* Swipe Instructions */}
            <div className="absolute left-0 -translate-x-full hidden md:flex items-center gap-2 text-gray-400">
              <ThumbsDown className="w-6 h-6" />
              <span>Swipe left to skip</span>
            </div>
            <div className="absolute right-0 translate-x-full hidden md:flex items-center gap-2 text-gray-400">
              <span>Swipe right to buy</span>
              <ThumbsUp className="w-6 h-6" />
            </div>

            {/* Mobile Instructions */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 md:hidden text-gray-400 text-sm whitespace-nowrap">
              Swipe left to skip, right to buy
            </div>

            <TokenCard token={currentToken} trustScore={trustScore} />
          </motion.div>

          {/* Action Buttons for non-touch devices */}
          <div className="flex justify-center gap-6 mt-8">
            <button
              onClick={handleSkip}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 transition-all"
            >
              <ThumbsDown className="w-5 h-5" />
              <span>Skip</span>
            </button>
            <button
              onClick={handleBuy}
              className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-400 transition-all"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
} 