import { Routes, Route, useNavigate } from 'react-router-dom';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import Auth from './components/Auth/Auth';
import LandingPage from './components/LandingPage';
import Browse from './components/Browse';
import Movies from './components/Movies';
// import TVShows from './components/TVShows';
import MyList from './components/MyList';
import Search from './components/Search';
import Profile from './components/Profile';
import Marketplace from './components/Marketplace/Marketplace';
import ClickSpark from './components/ClickSpark';
import React, { useEffect } from 'react';
import { WalletProvider } from './context/WalletContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoaderProvider } from './contexts/LoaderContext';
import ChatBot from './components/ChatBot/ChatBot';


function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { active } = useWeb3React();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    } else if (isAuthenticated && !active) {
      navigate('/');
    }
  }, [isAuthenticated, active, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !active) {
    return null;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <WalletProvider>
          <LoaderProvider>
            <div className="min-h-screen bg-dark">
              <ClickSpark
                sparkColor='#fff'
                sparkSize={10}
                sparkRadius={15}
                sparkCount={8}
                duration={400}
              />
              <Navbar />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
                <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
                {/* <Route path="/tv-shows" element={<TVShows />} /> */}
                <Route path="/my-list" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              </Routes>
              <ChatBot />
            </div>
          </LoaderProvider>
        </WalletProvider>
      </Web3ReactProvider>
    </AuthProvider>
  );
};

export default App;
