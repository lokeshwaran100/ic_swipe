import { useState } from 'react';
import { ic_swipe_backend } from 'declarations/ic_swipe_backend';
import { LoginComponent, useAuth } from './components/Login';
import { OnboardingPage } from './components/OnboardingPage';

function App() {
  const [greeting, setGreeting] = useState('');
  const [currentPage, setCurrentPage] = useState('onboarding'); // 'onboarding' or 'main'
  const [userProfile, setUserProfile] = useState(null);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    actor: null,
    principal: ''
  });

  // Handle authentication state changes
  const handleAuthChange = (newAuthState) => {
    setAuthState(newAuthState);
  };

  // Handle onboarding completion
  const handleOnboardingComplete = (userData) => {
    console.log('Onboarding completed with data:', userData);
    setUserProfile(userData);
    setCurrentPage('main');
  };

  // Handle going back to onboarding
  const handleGoToOnboarding = () => {
    setCurrentPage('onboarding');
    setUserProfile(null);
  };

  function handleSubmit(event) {
    console.log('handleSubmit');
    event.preventDefault();
    const name = event.target.elements.name.value;
    
    // Use authenticated actor if available, otherwise use default
    const actor = authState.actor || ic_swipe_backend;
    
    actor.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  // Show onboarding page by default
  if (currentPage === 'onboarding') {
    return <OnboardingPage onContinue={handleOnboardingComplete} />;
  }

  // Main application after onboarding
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
                 {/* Header with back to onboarding */}
         <div className="mb-8 flex justify-between items-center">
           <div className="flex items-center gap-3">
             <img src="/ICSwipe.png" alt="IcSwipe Logo" className="h-10 w-10" />
             <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
               IcSwipe
             </span>
           </div>
           <button
             onClick={handleGoToOnboarding}
             className="text-purple-600 hover:text-purple-800 font-medium"
           >
             Back to Onboarding
           </button>
         </div>

        {/* User Profile Display */}
        {userProfile && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Default Buy Amount:</span> {userProfile.defaultAmount} ICP
              </p>
              <p className="text-gray-600 text-sm break-all">
                <span className="font-medium">Principal:</span> {userProfile.principal}
              </p>
            </div>
          </div>
        )}
        
        {/* Authentication Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Authentication</h2>
          <LoginComponent 
            onAuthChange={handleAuthChange}
            showPrincipal={true}
          />
          
          {authState.isAuthenticated && (
            <div className="mt-4 text-green-600 font-semibold">
              ✅ Authenticated with Internet Identity
            </div>
          )}
        </div>

        {/* Original Greeting Section */}
        <div className="text-center bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Greeting Test</h2>
          <form action="#" onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
              <label htmlFor="name" className="text-gray-700 font-medium">
                Enter your name:
              </label>
              <input 
                id="name" 
                alt="Name" 
                type="text" 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button 
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
            >
              Click Me!
            </button>
          </form>
          <section id="greeting" className="mt-4 text-lg text-gray-700">{greeting}</section>
        </div>
      </div>
    </main>
  );
}

export default App;
