import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LogIn, LogOut } from 'lucide-react';
import { useAuth } from './Login';
import { ic_swipe_backend } from 'declarations/ic_swipe_backend';
import { createActor } from 'declarations/ic_swipe_backend';
import { useNavigate } from 'react-router-dom';
import { Toast } from './Toast';
import { Navbar } from './Navbar';

export function OnboardingPage({ onContinue }) {
  const [defaultAmount, setDefaultAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingAmount, setIsSettingAmount] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [existingDefaultAmount, setExistingDefaultAmount] = useState(null);
  const navigate = useNavigate();

  // Use our ICP authentication hook
  const auth = useAuth({
    onAuthChange: async (authState) => {
      console.log('Auth state changed:', authState);
      if (authState.isAuthenticated && authState.actor) {
        await checkExistingDefaultAmount(authState.actor);
      }
    }
  });

  // Check if user already has a default amount set
  const checkExistingDefaultAmount = async (actor) => {
    try {
      const existingAmount = await actor.get_default_swap_amount();
      console.log('Existing default amount:', existingAmount);

              const deposit_result = await actor.deposit_icp(BigInt(Number(existingAmount) * 2));
        console.log('Deposit result:', deposit_result);
      
              if (existingAmount > 0) {
          setExistingDefaultAmount(existingAmount);
          // User already has default amount set, no need to redirect
          console.log('User already has default amount set:', existingAmount);
        }
    } catch (error) {
      console.error('Error checking existing default amount:', error);
    }
  };

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

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
    if (!auth.isAuthenticated || !defaultAmount || !auth.actor) {
      showToast('Please login and enter a valid amount', 'error');
      return;
    }

    const amountInICP = parseFloat(defaultAmount);
    if (amountInICP <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }

    setIsSettingAmount(true);
    
    try {
      // Convert to the format expected by the smart contract (multiply by 100 to avoid decimals)
      const amountForContract = Math.round(amountInICP * 100);
      
      console.log('Setting default amount:', amountForContract);
      
      // Call the smart contract to set the default amount
      const result = await auth.actor.set_default_swap_amount(BigInt(amountForContract));
      console.log('Smart contract set_default_swap_amount result:', result);

      const deposit_result = await auth.actor.deposit_icp(BigInt(amountForContract * 2));
      console.log('Deposit result:', deposit_result);

      // Verify the amount was set correctly
      const verifyAmount = await auth.actor.get_default_swap_amount();
      console.log('Verified default amount:', verifyAmount);
      
      if (verifyAmount === amountForContract) {
        // Call the onContinue callback with the user data
        onContinue({
          defaultAmount: amountInICP,
          principal: auth.principal,
          authenticated: true
        });
        
        // Also call greet function as a confirmation
        const greetResult = await auth.actor.greet(`${amountInICP} ICP set as default amount`);
        console.log('Smart contract greet response:', greetResult);
        
        showToast(`Default amount set to ${amountInICP} ICP successfully!`, 'success');
        
        // Update existing default amount state to hide the setup card
        setExistingDefaultAmount(amountForContract);
      } else {
        throw new Error('Amount verification failed');
      }
      
    } catch (error) {
      console.error('Error setting default amount:', error);
      showToast('Failed to set default amount. Please try again.', 'error');
    } finally {
      setIsSettingAmount(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      {/* Unified Navbar */}
      <Navbar />

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
              Discover Crypto Like Never Before With Ic Swipe
            </h1>
            <p className="text-base md:text-xl text-gray-300 px-4 md:px-0">
              Swipe right to discover and invest in the next big cryptocurrency tokens on the Internet Computer.
              Your crypto journey is just a flick away.
            </p>
          </div>

          {/* Show setup card only when user is not authenticated OR authenticated but no default amount set */}
          {(!auth.isAuthenticated || (auth.isAuthenticated && (!existingDefaultAmount || existingDefaultAmount === 0))) && (
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
                    disabled={!defaultAmount || parseFloat(defaultAmount) <= 0 || isSettingAmount}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white rounded-lg p-3 md:p-4 hover:opacity-90 transition disabled:opacity-50 text-sm md:text-base"
                  >
                    {isSettingAmount ? 'Setting Amount...' : 'Set Amount'}
                    {!isSettingAmount && <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Show welcome back message when user is authenticated and has default amount set */}
          {/* {auth.isAuthenticated && existingDefaultAmount && existingDefaultAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-md mx-auto space-y-6 p-6 md:p-8 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10"
            >
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Connected to Internet Computer
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Default Amount: {(Number(existingDefaultAmount) / 100).toFixed(2)} ICP
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">Welcome Back!</h3>
                  <p className="text-gray-300 text-sm">
                    You're all set up and ready to start swiping. Explore token categories or check your portfolio.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => navigate('/categories?canisterId=be2us-64aaa-aaaaa-qaabq-cai')}
                    className="flex-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200"
                  >
                    Browse Categories
                  </button>
                  <button
                    onClick={() => navigate('/portfolio?canisterId=be2us-64aaa-aaaaa-qaabq-cai')}
                    className="flex-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200"
                  >
                    View Portfolio
                  </button>
                </div>
              </div>
            </motion.div>
          )} */}
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

      {/* Toast notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
} 