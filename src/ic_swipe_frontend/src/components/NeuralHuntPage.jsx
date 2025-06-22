import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ThumbsUp, ThumbsDown, Brain, Sparkles, Zap } from "lucide-react";
import { TokenCard } from "./TokenCard";
import { Toast } from "./Toast";
import { useAuth } from "./Login";
import { ic_swipe_backend } from 'declarations/ic_swipe_backend';
import { Navbar } from './Navbar';

// Enhanced AI SVG Icon
const AISVGIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#aiGradient)" stroke="#4F46E5" strokeWidth="2"/>
    {/* Neural network pattern */}
    <circle cx="30" cy="30" r="4" fill="white" opacity="0.9"/>
    <circle cx="70" cy="30" r="4" fill="white" opacity="0.9"/>
    <circle cx="50" cy="50" r="4" fill="white" opacity="0.9"/>
    <circle cx="30" cy="70" r="4" fill="white" opacity="0.9"/>
    <circle cx="70" cy="70" r="4" fill="white" opacity="0.9"/>
    {/* Connections */}
    <line x1="30" y1="30" x2="50" y2="50" stroke="white" strokeWidth="1" opacity="0.6"/>
    <line x1="70" y1="30" x2="50" y2="50" stroke="white" strokeWidth="1" opacity="0.6"/>
    <line x1="50" y1="50" x2="30" y2="70" stroke="white" strokeWidth="1" opacity="0.6"/>
    <line x1="50" y1="50" x2="70" y2="70" stroke="white" strokeWidth="1" opacity="0.6"/>
    <text x="50" y="85" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">AI</text>
  </svg>
);

export function NeuralHuntPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth({});
  
  // Get tokens and prompt from navigation state
  const { tokens: initialTokens, prompt } = location.state || {};
  
  const [tokens, setTokens] = useState(initialTokens || []);
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [userPortfolio, setUserPortfolio] = useState({});
  const [toast, setToast] = useState(null);
  const [defaultSwapAmount, setDefaultSwapAmount] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [icpBalance, setIcpBalance] = useState(0);
  
  const controls = useAnimation();
  const currentToken = tokens[currentTokenIndex];

  useEffect(() => {
    if (!initialTokens || !prompt) {
      navigate('/categories');
      return;
    }
    
    fetchUserData();
  }, [initialTokens, prompt, navigate]);

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

  const fetchUserData = async () => {
    if (!auth.isAuthenticated || !auth.actor) return;

    try {
      const balance = await auth.actor.get_user_icp_balance();
      const portfolio = await auth.actor.get_user_portfolio();
      
      setUserBalance(Number(balance));
      setIcpBalance(Number(balance));
      
      const portfolioObj = {};
      portfolio.token_balances.forEach(([symbol, amount]) => {
        portfolioObj[symbol] = Number(amount);
      });
      setUserPortfolio(portfolioObj);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Close toast function
  const closeToast = () => {
    setToast(null);
  };

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
    if (currentTokenIndex < tokens.length - 1) {
      setCurrentTokenIndex(prev => prev + 1);
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
    if (currentTokenIndex < tokens.length - 1) {
      setCurrentTokenIndex(prev => prev + 1);
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

  if (!currentToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Brain className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-2xl font-bold mb-2">AI Hunt Loading...</h2>
          <p className="text-gray-300">Preparing your AI-generated tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#001F3F] via-[#1A1A2E] to-[#2D1B3D] relative">
      {/* Unified Navbar */}
      <Navbar />

      {/* Category Header with Back Button */}
      <div className="fixed top-20 left-0 right-0 z-40 px-4 py-3 md:px-6 bg-black/10 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/categories')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back to Categories</span>
          </button>

          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              AI Hunt
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

      {/* AI Hunt Query Display */}
      {/* <div className="fixed top-32 left-0 right-0 z-30 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 backdrop-blur-lg rounded-xl border border-cyan-400/20 p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-cyan-300 text-sm font-medium">AI Hunt Query:</span>
            </div>
            <p className="text-white text-sm italic">"{prompt}"</p>
          </motion.div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="min-h-screen pt-52 pb-12 px-4 md:px-6 flex items-center justify-center">
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

            <TokenCard 
              token={{
                ...currentToken,
                svgIcon: <AISVGIcon />
              }}
              trustScore={Math.floor(Math.random() * 60) + 40}
              userBalance={userBalance}
              userPortfolio={userPortfolio}
              isAIGenerated={true}
            />
          </motion.div>

          {/* AI Reasoning Section */}
          {currentToken.aiReasoning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-xl border border-purple-400/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">AI Analysis:</span>
              </div>
              <p className="text-white/90 text-sm">{currentToken.aiReasoning}</p>
            </motion.div>
          )}

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