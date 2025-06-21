import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LogIn, LogOut, Menu } from 'lucide-react';
import { useAuth } from './Login';
import { ic_swipe_backend } from 'declarations/ic_swipe_backend';
import { useNavigate } from 'react-router-dom';

export function OnboardingPage({ onContinue }) {
  const [defaultAmount, setDefaultAmount] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Use our ICP authentication hook
  const auth = useAuth({
    onAuthChange: (authState) => {
      console.log('Auth state changed:', authState);
    }
  });

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await auth.login();
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await auth.logout();
      setDefaultAmount('');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    if (auth.isAuthenticated && defaultAmount) {
      // Call the onContinue callback with the user data
      onContinue({
        defaultAmount,
        principal: auth.principal,
        authenticated: true
      });
      const greetResult = await ic_swipe_backend.greet(`${defaultAmount} is set successfully`);
      console.log('Smart contract response:', greetResult); 
      navigate(`/categories?canisterId=be2us-64aaa-aaaaa-qaabq-cai`);
    }
  };

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
            {auth.isAuthenticated ? (
              <>
                <span className="text-gray-300 text-sm truncate max-w-[200px]">
                  {auth.principal !== 'Click "Whoami" to see your principal ID' ? auth.principal : 'Authenticated'}
                </span>
                <button 
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoading ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <button className="text-gray-300 hover:text-white transition">About</button>
                <button className="text-gray-300 hover:text-white transition">Features</button>
              </>
            )}
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
              {auth.isAuthenticated ? (
                <>
                  <span className="text-gray-300 text-sm">
                    {auth.principal !== 'Click "Whoami" to see your principal ID' ? auth.principal : 'Authenticated'}
                  </span>
                  <button 
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    {isLoading ? 'Logging out...' : 'Logout'}
                  </button>
                </>
              ) : (
                <>
                  <button className="text-gray-300 hover:text-white transition text-left">About</button>
                  <button className="text-gray-300 hover:text-white transition text-left">Features</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl text-center space-y-8 mb-12"
        >
          <div className="space-y-4 md:space-y-6">
            {/* Large logo in main content */}
            <div className="flex justify-center mb-6">
              <img 
                src="/ICSwipe.png" 
                alt="IcSwipe Logo" 
                className="w-20 h-20 md:w-24 md:h-24"
              />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
              Discover Crypto Like Never Before With IcSwipe
            </h1>
            <p className="text-base md:text-xl text-gray-300 px-4 md:px-0">
              Swipe right to discover and invest in the next big cryptocurrency tokens on the Internet Computer.
              Your crypto journey is just a flick away.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md mx-auto space-y-6 p-6 md:p-8 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10"
          >
            {!auth.isAuthenticated ? (
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white rounded-lg p-3 md:p-4 hover:opacity-90 transition text-sm md:text-base disabled:opacity-50"
              >
                <LogIn className="w-4 h-4 md:w-5 md:h-5" />
                {isLoading ? 'Connecting...' : 'Login with Internet Identity'}
              </button>
            ) : (
              <div className="space-y-4 md:space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Connected to Internet Computer
                  </div>
                </div>
                
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-gray-300">Default Buy Amount (ICP)</span>
                  <input
                    type="number"
                    value={defaultAmount}
                    onChange={(e) => setDefaultAmount(e.target.value)}
                    className="w-full p-3 md:p-4 rounded-lg bg-black/30 border border-white/10 focus:border-blue-500 outline-none transition text-white text-sm md:text-base"
                    placeholder="0.1"
                    step="0.01"
                    min="0"
                  />
                </label>
                
                <button
                  onClick={handleContinue}
                  disabled={!defaultAmount || parseFloat(defaultAmount) <= 0}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white rounded-lg p-3 md:p-4 hover:opacity-90 transition disabled:opacity-50 text-sm md:text-base"
                >
                  Set Amount
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Key Features Section */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10"
          >
            <div className="w-12 h-12 mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Swipe to Discover</h3>
            <p className="text-sm md:text-base text-gray-400">Find your next investment with our intuitive swipe interface built on ICP.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10"
          >
            <div className="w-12 h-12 mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
              <LogIn className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Decentralized Trading</h3>
            <p className="text-sm md:text-base text-gray-400">Trade tokens directly on-chain with the security of the Internet Computer.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10"
          >
            <div className="w-12 h-12 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <LogIn className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Portfolio Management</h3>
            <p className="text-sm md:text-base text-gray-400">Track and manage your ICP-based investments with real-time data.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 