import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function PortfolioCard({ token }) {
  const isPositive = token.priceChange >= 0;
  const formattedPrice = parseFloat(token.price).toFixed(6);
  const formattedChange = Math.abs(token.priceChange).toFixed(2);
  const formattedValue = parseFloat(token.value).toFixed(2);
  const formattedAmount = parseFloat(token.amount).toFixed(4);

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
              {token.image ? (
                <img 
                  src={token.image} 
                  alt={token.name}
                  className="w-12 h-12 rounded-full bg-gray-800"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {token.symbol.charAt(0)}
                  </span>
                </div>
              )}
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
            <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition text-sm font-medium">
              Buy More
            </button>
            <button className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition text-sm font-medium">
              Sell
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 