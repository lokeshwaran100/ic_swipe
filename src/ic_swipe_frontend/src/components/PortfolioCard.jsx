import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from './Login';

// SVG Icons for tokens (same as TokenCard)
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

export function PortfolioCard({ token, onSell, onBuyMore }) {
  const [isSelling, setIsSelling] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const auth = useAuth({});

  // Get SVG icon for token
  const getSVGIcon = () => {
    const svgType = token.svgIcon || 'DEFAULT';
    const symbol = token.symbol || "?";
    
    if (TokenSVGs[svgType]) {
      return svgType === 'DEFAULT' ? TokenSVGs[svgType](symbol) : TokenSVGs[svgType]();
    }
    
    return TokenSVGs.DEFAULT(symbol);
  };

  const isPositive = token.priceChange >= 0;
  const formattedPrice = parseFloat(token.price).toFixed(6);
  const formattedChange = Math.abs(token.priceChange).toFixed(2);
  const formattedValue = parseFloat(token.value).toFixed(2);
  const formattedAmount = parseFloat(token.amount).toFixed(4);

  const handleSell = async () => {
    if (!auth.isAuthenticated || !auth.actor) {
      if (onSell) {
        onSell({
          type: 'error',
          title: 'Authentication Required',
          message: 'Please login to sell tokens',
          duration: 4000
        });
      }
      return;
    }

    // Check if user has any tokens to sell
    if (parseFloat(token.amount) <= 0) {
      if (onSell) {
        onSell({
          type: 'error',
          title: 'No Tokens to Sell',
          message: `You don't have any ${token.symbol} tokens to sell`,
          duration: 3000
        });
      }
      return;
    }

    setIsSelling(true);
    
    try {
      // Convert the token amount to the format expected by the smart contract
      const tokenAmountToSell = Math.floor(parseFloat(token.amount) * 100); // Convert to contract format
      
      console.log('Selling tokens:', {
        symbol: token.symbol,
        amount: tokenAmountToSell,
        displayAmount: parseFloat(token.amount)
      });

      // Call the smart contract swap function
      const swapResult = await auth.actor.swap_token_to_icp(token.symbol, BigInt(tokenAmountToSell));
      console.log('Sell result:', swapResult);

      if (swapResult.success) {
        // Notify parent component of successful sale
        if (onSell) {
          onSell({
            type: 'success',
            title: 'Tokens Sold! 💰',
            message: `Successfully sold ${parseFloat(token.amount).toFixed(4)} ${token.symbol} for ${(tokenAmountToSell / 100).toFixed(2)} ICP`,
            duration: 4000,
            refreshNeeded: true
          });
        }
      } else {
        // Handle backend error
        if (onSell) {
          onSell({
            type: 'error',
            title: 'Sale Failed',
            message: swapResult.message || 'Failed to sell tokens',
            duration: 4000
          });
        }
      }

    } catch (error) {
      console.error('Error selling tokens:', error);
      
      if (onSell) {
        onSell({
          type: 'error',
          title: 'Sale Error',
          message: 'Failed to execute sale. Please try again.',
          duration: 4000
        });
      }
    } finally {
      setIsSelling(false);
    }
  };

  const handleBuyMore = async () => {
    if (onBuyMore) {
      onBuyMore(token);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group cursor-pointer"
    >
      <div className="p-6 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10 space-y-4">
          {/* Token Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800">
                {getSVGIcon()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {token.symbol}
                </h3>
                <p className="text-sm text-gray-400">
                  {token.name}
                </p>
              </div>
            </div>
            
            {/* Price change indicator */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              isPositive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {formattedChange}%
              </span>
            </div>
          </div>

          {/* Holdings */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Holdings</span>
              <span className="text-white font-medium">
                {formattedAmount} {token.symbol}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Current Price</span>
              <span className="text-white font-medium">
                ${formattedPrice}
              </span>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-gray-400 text-sm">Total Value</span>
              <span className="text-cyan-400 font-bold text-lg">
                ${formattedValue}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button 
              onClick={handleBuyMore}
              disabled={isBuying || isSelling}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isBuying && <Loader2 className="w-4 h-4 animate-spin" />}
              {isBuying ? 'Buying...' : 'Buy More'}
            </button>
            <button 
              onClick={handleSell}
              disabled={isSelling || isBuying || parseFloat(token.amount) <= 0}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSelling && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSelling ? 'Selling...' : 'Sell All'}
            </button>
          </div>

          {/* No tokens message */}
          {parseFloat(token.amount) <= 0 && (
            <div className="text-center py-2">
              <p className="text-gray-500 text-xs">No tokens available to sell</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 