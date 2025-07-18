import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Link as LinkIcon, ChevronsLeft, ChevronsRight, Brain, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Import SVG definitions from SwipePage
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

export function TokenCard({ token, trustScore, userBalance, userPortfolio, isAIGenerated = false }) {
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

  // Get SVG icon for token
  const getSVGIcon = () => {
    // If it's an AI-generated token and has a custom svgIcon component, use it
    if (isAIGenerated && React.isValidElement(token.svgIcon)) {
      return token.svgIcon;
    }
    
    const svgType = token.svgIcon || 'DEFAULT';
    const symbol = token.baseToken?.symbol || token.symbol || "?";
    
    if (TokenSVGs[svgType]) {
      return svgType === 'DEFAULT' ? TokenSVGs[svgType](symbol) : TokenSVGs[svgType]();
    }
    
    return TokenSVGs.DEFAULT(symbol);
  };

  return (
    <motion.div 
      className="w-full max-w-[320px] aspect-[3/4] rounded-2xl bg-black/30 backdrop-blur-lg p-6 md:p-8 border border-white/10 shadow-xl relative"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* AI Badge */}
      {isAIGenerated && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <Brain className="w-3 h-3" />
          AI
        </div>
      )}

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
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            {getSVGIcon()}
          </div>
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
          
          {/* AI Description */}
          {/* {isAIGenerated && token.description && (
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium mb-1">Description:</p>
              <p className="text-sm text-white/90">{token.description}</p>
            </div>
          )} */}

          {/* AI Token Category & Risk */}
          {isAIGenerated && (token.category || token.riskLevel) && (
            <div className="flex gap-2">
              {token.category && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-2 py-1">
                  <p className="text-xs text-blue-400 font-medium">{token.category}</p>
                </div>
              )}
              {token.riskLevel && (
                <div className={`border rounded-lg px-2 py-1 ${
                  token.riskLevel === 'Low' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                  token.riskLevel === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                  'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  <p className="text-xs font-medium">{token.riskLevel} Risk</p>
                </div>
              )}
            </div>
          )}
          
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
        {isAIGenerated && token.volume24h && (
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-sm text-gray-400">24h Volume</p>
            <p className="font-semibold text-white">{formatNumber(token.volume24h)}</p>
          </div>
        )}
        {isAIGenerated && token.holders && (
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-sm text-gray-400">Holders</p>
            <p className="font-semibold text-white">{token.holders.toLocaleString()}</p>
          </div>
        )}
        {!isAIGenerated && token.fdv && (
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-sm text-gray-400">FDV</p>
            <p className="font-semibold text-white">{formatNumber(token.fdv)}</p>
          </div>
        )}
        {/* {token.pairCreatedAt && (
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-sm text-gray-400">Created</p>
            <p className="font-semibold text-white">
              {new Date(token.pairCreatedAt * 1000).toLocaleDateString()}
            </p>
          </div>
        )} */}
      </div>

      {/* Links */}
      <div className="mt-6 md:mt-8">
        <div className="flex gap-2 justify-center flex-wrap">
          {/* AI Token Links */}
          {/* {isAIGenerated && token.website && (
            <a
              href={token.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-600/10 hover:from-cyan-400/20 hover:via-blue-500/20 hover:to-purple-600/20 text-white border border-white/10 transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <LinkIcon className="w-4 h-4" />
              Website
            </a>
          )} */}
          {/* {isAIGenerated && token.twitter && (
            <a
              href={token.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-600/10 hover:from-cyan-400/20 hover:via-blue-500/20 hover:to-purple-600/20 text-white border border-white/10 transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </a>
          )} */}
          
          {/* Regular Token Links */}
          {/* {!isAIGenerated && token.info?.websites?.[0] && (
            <a
              href={token.info.websites[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-600/10 hover:from-cyan-400/20 hover:via-blue-500/20 hover:to-purple-600/20 text-white border border-white/10 transition-all duration-300 flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              Website
            </a>
          )} */}
          {/* {token.url && (
            <a
              href={token.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-600/10 hover:from-cyan-400/20 hover:via-blue-500/20 hover:to-purple-600/20 text-white border border-white/10 transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <LinkIcon className="w-4 h-4" />
              DexScreener
            </a>
          )} */}
        </div>
      </div>
    </motion.div>
  );
} 