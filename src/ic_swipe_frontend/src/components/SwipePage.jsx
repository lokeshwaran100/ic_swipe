import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import { TokenCard } from "./TokenCard";
import { Toast } from "./Toast";
import { useAuth } from "./Login";
import { ic_swipe_backend } from 'declarations/ic_swipe_backend';
import { Navbar } from './Navbar';

// SVG Icons for tokens
const TokenSVGs = {
  // Doge-style SVG
  DOGE: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#C2A633" stroke="#B8860B" strokeWidth="2"/>
      <text x="50" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">DOGE</text>
      <circle cx="38" cy="45" r="3" fill="white"/>
      <circle cx="62" cy="45" r="3" fill="white"/>
      <path d="M35 60 Q50 70 65 60" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  ),
  
  // Shiba-style SVG
  SHIB: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#FFA500" stroke="#FF8C00" strokeWidth="2"/>
      <text x="50" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">SHIB</text>
      <polygon points="30,45 50,35 70,45 50,55" fill="white"/>
      <circle cx="42" cy="48" r="2" fill="#FFA500"/>
      <circle cx="58" cy="48" r="2" fill="#FFA500"/>
    </svg>
  ),
  
  // Pepe-style SVG
  PEPE: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#00FF00" stroke="#00CC00" strokeWidth="2"/>
      <text x="50" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">PEPE</text>
      <ellipse cx="40" cy="48" rx="4" ry="6" fill="white"/>
      <ellipse cx="60" cy="48" rx="4" ry="6" fill="white"/>
      <ellipse cx="40" cy="48" rx="2" ry="3" fill="black"/>
      <ellipse cx="60" cy="48" rx="2" ry="3" fill="black"/>
      <path d="M35 62 Q50 68 65 62" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  ),
  
  // Bitcoin-style SVG
  BTC: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#F7931A" stroke="#E8860F" strokeWidth="2"/>
      <text x="50" y="58" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">₿</text>
    </svg>
  ),
  
  // Ethereum-style SVG
  ETH: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#627EEA" stroke="#4A5FD1" strokeWidth="2"/>
      <polygon points="50,20 35,52 50,62 65,52" fill="white" opacity="0.8"/>
      <polygon points="50,20 65,52 50,40" fill="white"/>
      <polygon points="50,65 35,55 50,80 65,55" fill="white" opacity="0.6"/>
    </svg>
  ),
  
  // Generic token SVGs
  TOKEN1: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="2"/>
      <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="3"/>
      <circle cx="50" cy="50" r="8" fill="white"/>
    </svg>
  ),
  
  TOKEN2: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#10B981" stroke="#059669" strokeWidth="2"/>
      <polygon points="50,25 70,40 70,60 50,75 30,60 30,40" fill="white"/>
      <polygon points="50,35 60,42 60,58 50,65 40,58 40,42" fill="#10B981"/>
    </svg>
  ),
  
  TOKEN3: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>
      <rect x="35" y="35" width="30" height="30" rx="5" fill="white"/>
      <circle cx="50" cy="50" r="8" fill="#F59E0B"/>
    </svg>
  ),
  
  TOKEN4: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#EF4444" stroke="#DC2626" strokeWidth="2"/>
      <path d="M30 50 L50 30 L70 50 L50 70 Z" fill="white"/>
      <circle cx="50" cy="50" r="5" fill="#EF4444"/>
    </svg>
  ),
  
  TOKEN5: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#06B6D4" stroke="#0891B2" strokeWidth="2"/>
      <polygon points="50,20 25,40 25,60 50,80 75,60 75,40" fill="white"/>
      <polygon points="50,30 35,42 35,58 50,70 65,58 65,42" fill="#06B6D4"/>
    </svg>
  ),
  
  // AI-themed SVGs
  AI: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#6366F1" stroke="#4F46E5" strokeWidth="2"/>
      <circle cx="40" cy="40" r="6" fill="white"/>
      <circle cx="60" cy="40" r="6" fill="white"/>
      <circle cx="50" cy="60" r="4" fill="white"/>
      <path d="M35 70 Q50 75 65 70" stroke="white" strokeWidth="2" fill="none"/>
      <text x="50" y="85" textAnchor="middle" fontSize="8" fill="white">AI</text>
    </svg>
  ),
  
  // Default fallback
  DEFAULT: (symbol) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#6B7280" stroke="#4B5563" strokeWidth="2"/>
      <text x="50" y="58" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">
        {symbol?.slice(0, 3) || "?"}
      </text>
    </svg>
  )
};

// Mock token data for different categories - Low cap pump & dump tokens
const getMockTokens = (category) => {
  // Meme Coins - Low cap meme tokens
  const memeTokens = [
    {
      id: 1,
      name: "SafeMoon Inu",
      symbol: "SMINU",
      price: 0.0000000234,
      priceChange: { h24: "156.78" },
      marketCap: 2400000,
      liquidity: { usd: 45000 },
      fdv: 2450000,
      svgIcon: "DOGE",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 30,
      baseToken: { name: "SafeMoon Inu", symbol: "SMINU" }
    },
    {
      id: 2,
      name: "PepeCoin Classic",
      symbol: "PEPEC",
      price: 0.000000567,
      priceChange: { h24: "-34.12" },
      marketCap: 1800000,
      liquidity: { usd: 32000 },
      fdv: 1850000,
      svgIcon: "PEPE",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 15,
      baseToken: { name: "PepeCoin Classic", symbol: "PEPEC" }
    },
    {
      id: 3,
      name: "Bonk Killer",
      symbol: "BONKK",
      price: 0.00000123,
      priceChange: { h24: "89.45" },
      marketCap: 3200000,
      liquidity: { usd: 67000 },
      fdv: 3300000,
      svgIcon: "SHIB",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 12,
      baseToken: { name: "Bonk Killer", symbol: "BONKK" }
    },
    {
      id: 4,
      name: "DogeKing",
      symbol: "DOGEK",
      price: 0.0000456,
      priceChange: { h24: "234.67" },
      marketCap: 5600000,
      liquidity: { usd: 89000 },
      fdv: 5800000,
      svgIcon: "DOGE",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 8,
      baseToken: { name: "DogeKing", symbol: "DOGEK" }
    },
    {
      id: 5,
      name: "Meme Lord",
      symbol: "MLORD",
      price: 0.00000789,
      priceChange: { h24: "-67.23" },
      marketCap: 1200000,
      liquidity: { usd: 23000 },
      fdv: 1250000,
      svgIcon: "TOKEN1",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 20,
      baseToken: { name: "Meme Lord", symbol: "MLORD" }
    }
  ];

  // Risky Degens - Ultra high risk tokens
  const riskyTokens = [
    {
      id: 6,
      name: "Moon Shot",
      symbol: "MSHOT",
      price: 0.000000034,
      priceChange: { h24: "789.12" },
      marketCap: 890000,
      liquidity: { usd: 12000 },
      fdv: 920000,
      svgIcon: "BTC",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 5,
      baseToken: { name: "Moon Shot", symbol: "MSHOT" }
    },
    {
      id: 7,
      name: "Lambo Dreams",
      symbol: "LAMBO",
      price: 0.00000012,
      priceChange: { h24: "-89.34" },
      marketCap: 450000,
      liquidity: { usd: 8500 },
      fdv: 470000,
      svgIcon: "ETH",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 3,
      baseToken: { name: "Lambo Dreams", symbol: "LAMBO" }
    },
    {
      id: 8,
      name: "Yolo Finance",
      symbol: "YOLO",
      price: 0.0000789,
      priceChange: { h24: "456.78" },
      marketCap: 2100000,
      liquidity: { usd: 34000 },
      fdv: 2200000,
      svgIcon: "TOKEN2",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 7,
      baseToken: { name: "Yolo Finance", symbol: "YOLO" }
    },
    {
      id: 9,
      name: "Diamond Hands",
      symbol: "DIAMOND",
      price: 0.000234,
      priceChange: { h24: "-78.91" },
      marketCap: 3400000,
      liquidity: { usd: 56000 },
      fdv: 3500000,
      svgIcon: "TOKEN3",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 4,
      baseToken: { name: "Diamond Hands", symbol: "DIAMOND" }
    },
    {
      id: 10,
      name: "Rocket Fuel",
      symbol: "RKTFUEL",
      price: 0.00000456,
      priceChange: { h24: "1234.56" },
      marketCap: 1600000,
      liquidity: { usd: 28000 },
      fdv: 1650000,
      svgIcon: "TOKEN4",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 6,
      baseToken: { name: "Rocket Fuel", symbol: "RKTFUEL" }
    }
  ];

  // Newly Launched - Brand new tokens
  const newTokens = [
    {
      id: 11,
      name: "Fresh Launch",
      symbol: "FRESH",
      price: 0.000001234,
      priceChange: { h24: "2345.67" },
      marketCap: 320000,
      liquidity: { usd: 5600 },
      fdv: 340000,
      svgIcon: "TOKEN5",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 1,
      baseToken: { name: "Fresh Launch", symbol: "FRESH" }
    },
    {
      id: 12,
      name: "New Gem",
      symbol: "NEWGEM",
      price: 0.00000067,
      priceChange: { h24: "890.23" },
      marketCap: 180000,
      liquidity: { usd: 3400 },
      fdv: 190000,
      svgIcon: "TOKEN1",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 2,
      baseToken: { name: "New Gem", symbol: "NEWGEM" }
    },
    {
      id: 13,
      name: "Stealth Launch",
      symbol: "STEALTH",
      price: 0.0000234,
      priceChange: { h24: "567.89" },
      marketCap: 670000,
      liquidity: { usd: 12000 },
      fdv: 690000,
      svgIcon: "TOKEN2",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 0.5,
      baseToken: { name: "Stealth Launch", symbol: "STEALTH" }
    },
    {
      id: 14,
      name: "Early Bird",
      symbol: "EARLY",
      price: 0.000456,
      priceChange: { h24: "1456.78" },
      marketCap: 890000,
      liquidity: { usd: 16000 },
      fdv: 920000,
      svgIcon: "TOKEN3",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 1.5,
      baseToken: { name: "Early Bird", symbol: "EARLY" }
    },
    {
      id: 15,
      name: "Quick Pump",
      symbol: "QPUMP",
      price: 0.00123,
      priceChange: { h24: "3456.89" },
      marketCap: 1200000,
      liquidity: { usd: 23000 },
      fdv: 1250000,
      svgIcon: "TOKEN4",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 0.8,
      baseToken: { name: "Quick Pump", symbol: "QPUMP" }
    }
  ];

  // Blue Chips - Still low cap but more "established"
  const blueChipTokens = [
    {
      id: 16,
      name: "Mini Bitcoin",
      symbol: "MBTC",
      price: 0.234,
      priceChange: { h24: "12.34" },
      marketCap: 15000000,
      liquidity: { usd: 230000 },
      fdv: 15500000,
      svgIcon: "BTC",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 180,
      baseToken: { name: "Mini Bitcoin", symbol: "MBTC" }
    },
    {
      id: 17,
      name: "Pocket Ethereum",
      symbol: "PETH",
      price: 0.0567,
      priceChange: { h24: "-5.67" },
      marketCap: 8900000,
      liquidity: { usd: 145000 },
      fdv: 9200000,
      svgIcon: "ETH",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 120,
      baseToken: { name: "Pocket Ethereum", symbol: "PETH" }
    },
    {
      id: 18,
      name: "Stable Pump",
      symbol: "SPUMP",
      price: 0.123,
      priceChange: { h24: "8.91" },
      marketCap: 12300000,
      liquidity: { usd: 189000 },
      fdv: 12600000,
      svgIcon: "TOKEN5",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 200,
      baseToken: { name: "Stable Pump", symbol: "SPUMP" }
    }
  ];

  // AI Analyzed - "AI" themed low cap tokens
  const aiTokens = [
    {
      id: 19,
      name: "AI Doge",
      symbol: "AIDOGE",
      price: 0.000000123,
      priceChange: { h24: "456.78" },
      marketCap: 2800000,
      liquidity: { usd: 45000 },
      fdv: 2900000,
      svgIcon: "AI",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 45,
      baseToken: { name: "AI Doge", symbol: "AIDOGE" },
      aiScore: 85
    },
    {
      id: 20,
      name: "ChatBot Token",
      symbol: "CHATBOT",
      price: 0.00000456,
      priceChange: { h24: "234.56" },
      marketCap: 1900000,
      liquidity: { usd: 34000 },
      fdv: 1950000,
      svgIcon: "AI",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 30,
      baseToken: { name: "ChatBot Token", symbol: "CHATBOT" },
      aiScore: 92
    },
    {
      id: 21,
      name: "Neural Network",
      symbol: "NEURAL",
      price: 0.000234,
      priceChange: { h24: "123.45" },
      marketCap: 4500000,
      liquidity: { usd: 67000 },
      fdv: 4600000,
      svgIcon: "AI",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 60,
      baseToken: { name: "Neural Network", symbol: "NEURAL" },
      aiScore: 78
    },
    {
      id: 22,
      name: "Robot Coin",
      symbol: "ROBOT",
      price: 0.00123,
      priceChange: { h24: "67.89" },
      marketCap: 6700000,
      liquidity: { usd: 89000 },
      fdv: 6900000,
      svgIcon: "AI",
      url: "https://dexscreener.com/ethereum/0x...",
      pairCreatedAt: Date.now() / 1000 - 86400 * 75,
      baseToken: { name: "Robot Coin", symbol: "ROBOT" },
      aiScore: 88
    }
  ];

  // Customize tokens based on category
  switch (category) {
    case 'meme-coins':
      return memeTokens;
    case 'risky-degens':
      return riskyTokens;
    case 'newly-launched':
      return newTokens;
    case 'blue-chips':
      return blueChipTokens;
    case 'ai-analyzed':
      return aiTokens;
    default:
      return memeTokens;
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
  const [defaultSwapAmount, setDefaultSwapAmount] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [icpBalance, setIcpBalance] = useState(0);
  const controls = useAnimation();
  
  // Add authentication
  const auth = useAuth({});

  // Initialize tokens and trust score
  useEffect(() => {
    const mockTokens = getMockTokens(category);
    setTokens(mockTokens);
    setTrustScore(Math.floor(Math.random() * 60) + 40); // Random trust score 40-100
    setLoading(false);
  }, [category]);

  // Get user's default swap amount and ICP balance when authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.isAuthenticated && auth.actor) {
        try {
          const [amount, balance] = await Promise.all([
            auth.actor.get_default_swap_amount(),
            auth.actor.get_user_icp_balance()
          ]);
          console.log('Default swap amount:', amount);
          console.log('ICP balance:', balance);
          setDefaultSwapAmount(Number(amount));
          setIcpBalance(Number(balance));
        } catch (error) {
          console.error('Error getting user data:', error);
        }
      }
    };

    fetchUserData();
  }, [auth.isAuthenticated, auth.actor]);

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
    // Check if user is authenticated
    if (!auth.isAuthenticated || !auth.actor) {
      setToast({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please login with Internet Identity to purchase tokens',
        duration: 4000
      });
      return;
    }

    // Check if default swap amount is set
    if (!defaultSwapAmount || defaultSwapAmount <= 0) {
      setToast({
        type: 'error',
        title: 'Default Amount Not Set',
        message: 'Please set your default swap amount in the onboarding page',
        duration: 4000
      });
      return;
    }

    // Check if user has sufficient ICP balance
    if (icpBalance < defaultSwapAmount) {
      setToast({
        type: 'error',
        title: 'Insufficient Balance',
        message: `You need ${(defaultSwapAmount / 100).toFixed(2)} ICP but only have ${(icpBalance / 100).toFixed(2)} ICP. Please deposit more ICP.`,
        duration: 5000
      });
      return;
    }

    setIsSwapping(true);
    console.log('Buying token:', currentToken);
    console.log('Using default swap amount:', defaultSwapAmount);
    
    try {
      const tokenSymbol = currentToken.baseToken?.symbol || currentToken.symbol;
      const tokenName = currentToken.baseToken?.name || currentToken.name;
      
      console.log('Making swap_icp_to_token call with:', {
        tokenSymbol,
        amount: defaultSwapAmount
      });
      
      // Call the smart contract swap function
      const swapResult = await auth.actor.swap_icp_to_token(tokenSymbol, BigInt(defaultSwapAmount));
      console.log('Swap result:', swapResult);
      
         if (swapResult.success) {
         // Update local ICP balance
         setIcpBalance(Number(swapResult.new_icp_balance));
         
         // Show success toast
      setToast({
        type: 'success',
        title: 'Token Purchased! 🚀',
           message: `Successfully swapped ${(defaultSwapAmount / 100).toFixed(2)} ICP for ${tokenName}. New ICP balance: ${(Number(swapResult.new_icp_balance) / 100).toFixed(2)}`,
           duration: 5000
         });
       } else {
        // Show error toast with backend message
        setToast({
          type: 'error',
          title: 'Swap Failed',
          message: swapResult.message || 'Failed to swap tokens',
        duration: 4000
      });
      }
      
    } catch (error) {
      console.error('Error calling swap_icp_to_token:', error);
      
      // Show error toast
      setToast({
        type: 'error',
        title: 'Swap Error',
        message: 'Failed to execute swap. Please try again.',
        duration: 4000
      });
    } finally {
      setIsSwapping(false);
    }
    
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
        // Swipe right - buy token
        await controls.start({ x: 500, opacity: 0 });
        await handleBuy();
      } else {
        // Swipe left - skip token
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
      {/* Unified Navbar */}
      <Navbar />

      {/* Category Header with Back Button */}
      <div className="fixed top-20 left-0 right-0 z-40 px-4 py-3 md:px-6 bg-black/10 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back to Categories</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {getCategoryTitle(category)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Authentication Status & Balance Info */}
            <div className="hidden md:flex items-center gap-4">
              {auth.isAuthenticated && (
                <div className="flex items-center gap-2">
                  {defaultSwapAmount > 0 && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <span className="text-xs text-blue-400">
                        Amount: {(defaultSwapAmount / 100).toFixed(2)} ICP
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-2 py-1 bg-green-500/20 rounded-lg border border-green-500/30">
                    <span className="text-xs text-green-400">
                      Balance: {(icpBalance / 100).toFixed(2)} ICP
              </span>
                  </div>
                </div>
              )}
            </div>
            
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
      <div className="min-h-screen pt-40 pb-12 px-4 md:px-6 flex items-center justify-center">
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
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 md:hidden flex flex-col items-center gap-2">
              <div className="text-gray-400 text-sm whitespace-nowrap">
              Swipe left to skip, right to buy
              </div>
              {auth.isAuthenticated && (
                <div className="flex flex-col items-center gap-1">
                  {defaultSwapAmount > 0 && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <span className="text-xs text-blue-400">
                        Amount: {(defaultSwapAmount / 100).toFixed(2)} ICP
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-2 py-1 bg-green-500/20 rounded-lg border border-green-500/30">
                    <span className="text-xs text-green-400">
                      Balance: {(icpBalance / 100).toFixed(2)} ICP
                    </span>
                  </div>
                </div>
              )}
              {!auth.isAuthenticated && (
                <div className="text-orange-400 text-xs">
                  Login required to purchase
                </div>
              )}
            </div>

            <TokenCard token={currentToken} trustScore={trustScore} />
          </motion.div>

          {/* Action Buttons for non-touch devices */}
          <div className="flex justify-center gap-6 mt-8">
            <button
              onClick={handleSkip}
              disabled={isSwapping}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 transition-all disabled:opacity-50"
            >
              <ThumbsDown className="w-5 h-5" />
              <span>Skip</span>
            </button>
            <button
              onClick={handleBuy}
              disabled={isSwapping}
              className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-400 transition-all disabled:opacity-50"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>{isSwapping ? 'Swapping...' : 'Buy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
} 