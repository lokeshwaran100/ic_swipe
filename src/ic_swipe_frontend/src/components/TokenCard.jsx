import { ArrowUpRight, ArrowDownRight, Link as LinkIcon, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustScore = ({ score, className = "" }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'High Trust';
    if (score >= 60) return 'Medium Trust';
    if (score >= 40) return 'Low Trust';
    return 'Very Low Trust';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < Math.floor(score / 20) ? getScoreColor(score) : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
      <span className={`text-sm font-medium ${getScoreColor(score)}`}>
        {getScoreLabel(score)}
      </span>
    </div>
  );
};

export function TokenCard({ token, trustScore }) {
  // Get 24h price change and determine if it's positive
  const priceChange = parseFloat(token.priceChange?.h24 || "0");
  const isPositive = priceChange >= 0;

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  // Handle missing image URL
  const imageUrl = token.info?.imageUrl || token.image || "/placeholder-token.png";

  return (
    <motion.div 
      className="w-full max-w-[320px] aspect-[3/4] rounded-2xl bg-black/30 backdrop-blur-lg p-6 md:p-8 border border-white/10 shadow-xl relative"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Swipe Indicators */}
      <div className="absolute inset-y-0 -left-8 flex items-center text-red-400/50">
        <ChevronsLeft className="w-10 h-10 animate-pulse" />
      </div>
      <div className="absolute inset-y-0 -right-8 flex items-center text-green-400/50">
        <ChevronsRight className="w-10 h-10 animate-pulse" />
      </div>

      <div className="flex flex-col items-center justify-center gap-6">
        {/* Token Image */}
        <div className="relative w-28 h-28 md:w-32 md:h-32">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50" />
          <img
            src={imageUrl}
            alt={token.baseToken?.name || token.name}
            className="rounded-2xl object-cover relative w-full h-full"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/128x128/1f2937/9ca3af?text=" + 
                (token.baseToken?.symbol || token.symbol || "?");
            }}
          />
        </div>

        {/* Token Info */}
        <div className="w-full text-center space-y-3">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white">
              {token.baseToken?.name || token.name}
            </h3>
            <p className="text-sm text-gray-400">
              {token.baseToken?.symbol || token.symbol}
            </p>
          </div>
          
          <TrustScore score={trustScore} className="justify-center" />
          
          <div className="flex items-center justify-center gap-4 bg-white/5 rounded-xl p-3">
            <div>
              <p className="text-sm text-gray-400">Price</p>
              <p className="text-lg font-semibold text-white">
                ${parseFloat(token.priceUsd || token.price || 0).toFixed(6)}
              </p>
            </div>

            {token.priceChange && (
              <div
                className={`flex items-center gap-1 ${
                  isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(priceChange).toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Token Stats */}
      <div className="mt-6 md:mt-8 grid grid-cols-2 gap-4 md:gap-6">
        {token.liquidity && (
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-sm text-gray-400">Liquidity</p>
            <p className="font-semibold text-white">
              {typeof token.liquidity === 'object' 
                ? formatNumber(token.liquidity.usd || 0)
                : formatNumber(token.liquidity)
              }
            </p>
          </div>
        )}
        {token.marketCap && (
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-sm text-gray-400">Market Cap</p>
            <p className="font-semibold text-white">{formatNumber(token.marketCap)}</p>
          </div>
        )}
        {token.fdv && (
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-sm text-gray-400">FDV</p>
            <p className="font-semibold text-white">{formatNumber(token.fdv)}</p>
          </div>
        )}
        {token.pairCreatedAt && (
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-sm text-gray-400">Created</p>
            <p className="font-semibold text-white">
              {new Date(token.pairCreatedAt * 1000).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Links */}
      <div className="mt-6 md:mt-8">
        <div className="flex gap-3 justify-center">
          {token.info?.websites?.[0] && (
            <a
              href={token.info.websites[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-600/10 hover:from-cyan-400/20 hover:via-blue-500/20 hover:to-purple-600/20 text-white border border-white/10 transition-all duration-300 flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              Website
            </a>
          )}
          {token.url && (
            <a
              href={token.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-600/10 hover:from-cyan-400/20 hover:via-blue-500/20 hover:to-purple-600/20 text-white border border-white/10 transition-all duration-300 flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              DexScreener
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
} 