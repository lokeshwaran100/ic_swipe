import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PortfolioCard } from "./PortfolioCard";
import { Wallet } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from "./Login";
import { Toast } from "./Toast";
import { Navbar } from "./Navbar";

export function PortfolioPage() {
  const [inputValue, setInputValue] = useState("");
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [isUpdatingAmount, setIsUpdatingAmount] = useState(false);
  
  // Add authentication
  const auth = useAuth({});

  // Mock token price data (you can replace this with real price API later)
  const getTokenPrice = (symbol) => {
    const mockPrices = {
      'DOGE': 0.072345,
      'SHIB': 0.000008234,
      'PEPE': 0.00000123,
      'FLOKI': 0.00003456,
      'BABYDOGE': 0.0000000023,
      'BTC': 43250.75,
      'ETH': 2650.25,
      'ICP': 12.45
    };
    return mockPrices[symbol] || 1.0;
  };

  // Mock price changes (you can replace this with real data later)
  const getMockPriceChange = (symbol) => {
    const mockChanges = {
      'DOGE': 5.67,
      'SHIB': -2.34,
      'PEPE': 12.45,
      'FLOKI': 8.92,
      'BABYDOGE': -1.23,
      'BTC': -2.34,
      'ETH': 8.92,
      'ICP': 5.67
    };
    return mockChanges[symbol] || 0;
  };

  // Fetch portfolio data from smart contract
  const fetchPortfolioData = async (showLoading = true) => {
    if (!auth.isAuthenticated || !auth.actor) {
      console.log('User not authenticated, cannot fetch portfolio');
      setLoading(false);
      return;
    }

    if (showLoading) setLoading(true);
    if (!showLoading) setRefreshing(true);

    try {
      console.log('Fetching portfolio data...');
      const portfolio = await auth.actor.get_user_portfolio();
      console.log('Portfolio data:', portfolio);

      // Transform the data for the UI
      const transformedData = {
        icp_balance: Number(portfolio.icp_balance),
        default_swap_amount: Number(portfolio.default_swap_amount),
        total_deposits: Number(portfolio.total_deposits),
        total_swaps: Number(portfolio.total_swaps),
        tokens: portfolio.token_balances.map(([symbol, balance]) => {
          const price = getTokenPrice(symbol);
          const amount = (Number(balance) / 100); // Convert from contract format
          const value = amount * price;
          
          return {
            symbol,
            name: getTokenName(symbol),
            price,
            priceChange: getMockPriceChange(symbol),
            amount: amount.toString(),
            value: value.toString(),
            image: getTokenImage(symbol)
          };
        })
      };

      setPortfolioData(transformedData);
      setInputValue((transformedData.default_swap_amount / 100).toString());
      
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setToast({
        type: 'error',
        title: 'Portfolio Load Error',
        message: 'Failed to load portfolio data. Please try again.',
        duration: 4000
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper functions for token metadata
  const getTokenName = (symbol) => {
    const names = {
      'DOGE': 'Dogecoin',
      'SHIB': 'Shiba Inu',
      'PEPE': 'Pepe',
      'FLOKI': 'Floki Inu',
      'BABYDOGE': 'Baby Doge Coin',
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'ICP': 'Internet Computer'
    };
    return names[symbol] || symbol;
  };

  const getTokenImage = (symbol) => {
    const images = {
      'DOGE': 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
      'SHIB': 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png',
      'PEPE': 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg',
      'FLOKI': 'https://cryptologos.cc/logos/floki-inu-floki-logo.png',
      'BABYDOGE': 'https://assets.coingecko.com/coins/images/16125/large/babydoge.jpg',
      'ICP': '/ICSwipe.png'
    };
    return images[symbol] || null;
  };

  // Update default amount
  const updateDefaultAmount = async () => {
    if (!auth.isAuthenticated || !auth.actor) {
      setToast({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please login to update your default amount',
        duration: 4000
      });
      return;
    }

    const amount = parseFloat(inputValue);
    if (!amount || amount <= 0) {
      setToast({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount greater than 0',
        duration: 4000
      });
      return;
    }

    setIsUpdatingAmount(true);
    try {
      const amountForContract = Math.round(amount * 100);
      console.log('Updating default amount to:', amountForContract);
      
      await auth.actor.set_default_swap_amount(BigInt(amountForContract));
      
      setToast({
        type: 'success',
        title: 'Amount Updated',
        message: `Default amount set to ${amount} ICP`,
        duration: 3000
      });

      // Refresh portfolio data
      await fetchPortfolioData(false);
      
    } catch (error) {
      console.error('Error updating default amount:', error);
      setToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update default amount. Please try again.',
        duration: 4000
      });
    } finally {
      setIsUpdatingAmount(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPortfolioData();
  }, [auth.isAuthenticated, auth.actor]);

  const closeToast = () => {
    setToast(null);
  };

  // Handle sell events from PortfolioCard
  const handleSell = async (sellEvent) => {
    setToast(sellEvent);
    
    // If sale was successful, refresh portfolio data
    if (sellEvent.refreshNeeded) {
      setTimeout(() => {
        fetchPortfolioData(false);
      }, 1000); // Small delay to let the transaction settle
    }
  };

  // Handle buy more events from PortfolioCard
  const handleBuyMore = (token) => {
    setToast({
      type: 'info',
      title: 'Buy More Tokens',
      message: `To buy more ${token.symbol}, use the swipe feature in the categories section`,
      duration: 4000
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-transparent animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="max-w-md mx-4 bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-8 text-center">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white mb-4">Portfolio Access</h2>
          <p className="text-gray-400 mb-6">
            Please login with Internet Identity to view your portfolio
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      {/* Unified Navbar */}
      <Navbar 
        onRefresh={() => fetchPortfolioData(false)} 
        refreshing={refreshing} 
      />

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
                    placeholder="0.00"
                  />
                  <button
                    onClick={updateDefaultAmount}
                    disabled={isUpdatingAmount}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white hover:opacity-90 transition text-sm font-medium disabled:opacity-50"
                  >
                    {isUpdatingAmount ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>
            </div>

            {/* Current Balance Display */}
            {portfolioData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">Account Balance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">ICP Balance</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      {(portfolioData.icp_balance / 100).toFixed(2)} ICP
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Default Swap Amount</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {(portfolioData.default_swap_amount / 100).toFixed(2)} ICP
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Portfolio Grid */}
            {portfolioData && portfolioData.tokens.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {portfolioData.tokens.map((token, index) => (
                  <motion.div
                    key={token.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PortfolioCard token={token} onSell={handleSell} onBuyMore={handleBuyMore} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center"
              >
                <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-white mb-2">No Tokens Yet</h3>
                <p className="text-gray-400 mb-6">
                  Start swiping to build your token portfolio!
                </p>
                <Link
                  to="/categories?canisterId=be2us-64aaa-aaaaa-qaabq-cai"
                  className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200"
                >
                  Start Swiping
                </Link>
              </motion.div>
            )}

            {/* Portfolio Summary */}
            {portfolioData && portfolioData.tokens.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">Portfolio Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Total Value</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      ${portfolioData.tokens.reduce((sum, token) => sum + parseFloat(token.value), 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Total Tokens</p>
                    <p className="text-2xl font-bold text-white">
                      {portfolioData.tokens.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Total Deposits</p>
                    <p className="text-2xl font-bold text-green-400">
                      {(portfolioData.total_deposits / 100).toFixed(2)} ICP
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Total Swaps</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {(portfolioData.total_swaps / 100).toFixed(2)} ICP
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

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

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
} 