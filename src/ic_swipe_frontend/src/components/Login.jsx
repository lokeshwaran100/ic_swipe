import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from 'declarations/ic_swipe_backend';
import { canisterId } from 'declarations/ic_swipe_backend/index.js';

const network = process.env.DFX_NETWORK;
const identityProvider = 'https://identity.ic0.app';
// const identityProvider =
//   network === 'ic'
//     ? 'https://identity.ic0.app' // Mainnet
//     : 'http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943'; // Local II canister ID

// Reusable button component with Tailwind styles
const Button = ({ onClick, children, className = '' }) => (
  <button 
    onClick={onClick} 
    className={`
      px-6 py-3 
      border-none rounded-lg 
      text-base font-semibold 
      cursor-pointer 
      transition-all duration-200 ease-in-out 
      min-w-[200px]
      hover:-translate-y-0.5 hover:shadow-lg
      disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
      ${className}
    `}
  >
    {children}
  </button>
);

const Login = ({ onAuthChange }) => {
  const [state, setState] = useState({
    actor: undefined,
    authClient: undefined,
    isAuthenticated: false,
    principal: 'Click "Whoami" to see your principal ID',
    loading: false
  });

  // Initialize auth client
  useEffect(() => {
    updateActor();
  }, []);

  // Call onAuthChange when authentication state changes
  useEffect(() => {
    if (onAuthChange) {
      onAuthChange({
        isAuthenticated: state.isAuthenticated,
        actor: state.actor,
        principal: state.principal
      });
    }
  }, [state.isAuthenticated, state.actor, state.principal, onAuthChange]);

  const updateActor = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const actor = createActor(canisterId, {
        agentOptions: {
          identity
        }
      });
      const isAuthenticated = await authClient.isAuthenticated();

      setState((prev) => ({
        ...prev,
        actor,
        authClient,
        isAuthenticated,
        loading: false
      }));
    } catch (error) {
      console.error('Error updating actor:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const login = async () => {
    console.log('login');
    console.log('Auth client available:', !!state.authClient);
    
    if (!state.authClient) {
      console.error('AuthClient not initialized');
      return;
    }
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      console.log('Using identity provider:', identityProvider);
      const result = await state.authClient.login({
        identityProvider,
        onSuccess: () => {
          console.log('Login successful, updating actor...');
          updateActor();
        },
        onError: (error) => {
          console.error('Login onError callback:', error);
          setState(prev => ({ ...prev, loading: false }));
        }
      });
      console.log('login result', result);
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await state.authClient.logout();
      await updateActor();
    } catch (error) {
      console.error('Logout error:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const whoami = async () => {
    setState((prev) => ({
      ...prev,
      principal: 'Loading...'
    }));
    console.log('whoami');

    try {
      const result = await state.actor.whoami();
      console.log('whomi result', result);
      const principal = result.toString();
      setState((prev) => ({
        ...prev,
        principal
      }));
    } catch (error) {
      console.error('Whoami error:', error);
      setState((prev) => ({
        ...prev,
        principal: 'Error loading principal'
      }));
    }
  };

  return {
    // Export the authentication state and methods
    isAuthenticated: state.isAuthenticated,
    principal: state.principal,
    actor: state.actor,
    loading: state.loading,
    login,
    logout,
    whoami,
    
    // Export the UI components with Tailwind styles
    LoginButton: () => (
      <Button 
        onClick={login} 
        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
      >
        {state.loading ? 'Connecting...' : 'Login with Internet Identity'}
      </Button>
    ),
    
    LogoutButton: () => (
      <Button 
        onClick={logout} 
        className="bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600"
      >
        {state.loading ? 'Disconnecting...' : 'Logout'}
      </Button>
    ),
    
    WhoamiButton: () => (
      <Button 
        onClick={whoami} 
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
      >
        Whoami
      </Button>
    ),
    
    // Main login/logout toggle button
    AuthButton: () => (
      !state.isAuthenticated ? (
        <Button 
          onClick={login} 
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
        >
          {state.loading ? 'Connecting...' : 'Login with Internet Identity'}
        </Button>
      ) : (
        <Button 
          onClick={logout} 
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600"
        >
          {state.loading ? 'Disconnecting...' : 'Logout'}
        </Button>
      )
    )
  };
};

// Full Login Component with UI using Tailwind
export const LoginComponent = ({ onAuthChange, showPrincipal = false }) => {
  const auth = Login({ onAuthChange });

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2 items-center">
        <auth.AuthButton />
        {showPrincipal && (
          <>
            <auth.WhoamiButton />
            {auth.principal && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500 max-w-full break-all">
                <h4 className="mb-2 text-gray-800 text-sm font-semibold">Principal ID:</h4>
                <p className="m-0 font-mono text-xs text-gray-600 bg-white p-2 rounded">
                  {auth.principal}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Export the hook for use in other components
export const useAuth = Login;

export default Login; 