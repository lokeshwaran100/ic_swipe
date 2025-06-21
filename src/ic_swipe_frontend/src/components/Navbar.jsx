import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Grid3X3, Wallet, User, Settings, LogOut, RefreshCw } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './Login';

export function Navbar({ onRefresh, refreshing = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth({});

  // Navigation items with icons
  const navigationItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      show: 'always' // always, authenticated, unauthenticated
    },
    {
      name: 'Categories',
      path: '/categories?canisterId=be2us-64aaa-aaaaa-qaabq-cai',
      icon: Grid3X3,
      show: 'always'
    },
    {
      name: 'Portfolio',
      path: '/portfolio?canisterId=be2us-64aaa-aaaaa-qaabq-cai',
      icon: Wallet,
      show: 'always'
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      show: 'authenticated',
      disabled: true // Placeholder for future implementation
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      show: 'authenticated',
      disabled: true // Placeholder for future implementation
    }
  ];

  // Check if current path matches navigation item
  const isActivePath = (itemPath) => {
    const currentPath = location.pathname;
    const itemBasePath = itemPath.split('?')[0]; // Remove query params for comparison
    
    // Exact match for home
    if (itemBasePath === '/' && currentPath === '/') return true;
    
    // For other paths, check if current path starts with item path
    if (itemBasePath !== '/' && currentPath.startsWith(itemBasePath)) return true;
    
    return false;
  };

  // Filter navigation items based on authentication status and show property
  const getVisibleNavItems = () => {
    return navigationItems.filter(item => {
      if (item.show === 'always') return true;
      if (item.show === 'authenticated' && auth.isAuthenticated) return true;
      if (item.show === 'unauthenticated' && !auth.isAuthenticated) return true;
      return false;
    });
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleRefresh = () => {
    if (onRefresh && !refreshing) {
      onRefresh();
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-6 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
          <img 
            src="/ICSwipe.png" 
            alt="IcSwipe Logo" 
            className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-200 group-hover:scale-110"
          />
          <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            IcSwipe
          </span>
        </Link>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Refresh button (if provided) */}
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 px-3 py-2 rounded-lg hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>
          )}

          {/* Navigation Items */}
          {getVisibleNavItems().map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.disabled ? '#' : item.path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 relative
                  ${item.disabled 
                    ? 'text-gray-500 cursor-not-allowed opacity-50' 
                    : isActive
                      ? 'text-white bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-500/20'
                  }
                `}
                onClick={item.disabled ? (e) => e.preventDefault() : closeMenu}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.name}</span>
                
                {/* Active indicator */}
                {isActive && !item.disabled && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Hover glow effect */}
                {!item.disabled && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-purple-500/0 hover:from-cyan-500/5 hover:to-purple-500/5 rounded-lg transition-all duration-200" />
                )}
              </Link>
            );
          })}

          {/* Authentication Actions */}
          {auth.isAuthenticated ? (
            <div className="flex items-center gap-4 pl-4 border-l border-white/20">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-xs text-gray-400">Authenticated</span>
                <span className="text-xs text-cyan-400 max-w-[120px] truncate">
                  {auth.principal !== 'Click "Whoami" to see your principal ID' ? 
                    auth.principal.slice(0, 8) + '...' : 'Connected'
                  }
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 text-orange-400 text-sm">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              Anonymous
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl md:hidden border-b border-white/10 overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {/* Refresh button (if provided) */}
              {onRefresh && (
                <button
                  onClick={() => { handleRefresh(); closeMenu(); }}
                  disabled={refreshing}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-200 text-left px-4 py-3 rounded-lg hover:bg-white/10 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="font-medium">
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </span>
                </button>
              )}

              {/* Navigation Items */}
              {getVisibleNavItems().map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Link
                    key={item.name}
                    to={item.disabled ? '#' : item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 relative
                      ${item.disabled 
                        ? 'text-gray-500 cursor-not-allowed opacity-50' 
                        : isActive
                          ? 'text-white bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }
                    `}
                    onClick={item.disabled ? (e) => e.preventDefault() : closeMenu}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    
                    {isActive && !item.disabled && (
                      <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full" />
                    )}
                  </Link>
                );
              })}

              {/* Authentication Section */}
              <div className="border-t border-white/20 pt-4 mt-2">
                {auth.isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2">
                      <div className="text-xs text-gray-400 mb-1">Authenticated as:</div>
                      <div className="text-xs text-cyan-400 break-all">
                        {auth.principal !== 'Click "Whoami" to see your principal ID' ? 
                          auth.principal : 'Connected'
                        }
                      </div>
                    </div>
                    <button
                      onClick={() => { handleLogout(); closeMenu(); }}
                      className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-200 text-left px-4 py-3 rounded-lg hover:bg-red-500/20 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-3 text-orange-400 text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                    Anonymous Mode
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 