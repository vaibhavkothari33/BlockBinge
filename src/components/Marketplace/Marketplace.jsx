import React, { useState, useEffect } from 'react';
import { FaEthereum, FaSearch, FaFilter } from 'react-icons/fa';
import { useWeb3React } from '@web3-react/core';
import MovieCard from './MovieCard';
import { useWallet } from '../../context/WalletContext';
import { useLoader } from '../../contexts/LoaderContext';

const Marketplace = () => {
  const { active, account } = useWeb3React();
  const { connectWallet, isConnecting } = useWallet();
  const { setIsLoading } = useLoader();
  const [filter, setFilter] = useState('all'); // all, forSale, owned
  const [searchQuery, setSearchQuery] = useState('');

  // Add loading effect when component mounts
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  // Also add loading when filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [filter, setIsLoading]);

  const categories = [
    { id: 'all', name: 'All NFTs' },
    { id: 'forSale', name: 'For Sale' },
    { id: 'owned', name: 'My Collection' }
  ];

  const movieNFTs = [
    {
      id: 1,
      title: "The Dark Knight",
      image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      price: 0.0001,
      owner: "0x1234...5678",
      forSale: true,
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.",
      tokenId: 1
    },
    {
      id: 2,
      title: "Inception",
      image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
      price: 0.000215,
      owner: "0x9876...4321",
      forSale: true,
      description: "A thief who steals corporate secrets through dream-sharing technology.",
      tokenId: 2
    },
    {
      id: 3,
      title: "Interstellar",
      image: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
      price: 0.002,
      owner: account || "0x5432...8765", // Use connected account as owner for testing
      forSale: false,
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      tokenId: 3
    }
  ];

  const filteredNFTs = movieNFTs.filter(nft => {
    if (!account) return true; // Show all if not connected
    if (filter === 'forSale') return nft.forSale;
    if (filter === 'owned') return nft.owner === account;
    return true;
  }).filter(nft => 
    nft.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/20 to-dark py-16 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-1/2 h-full bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/4 w-1/2 h-full bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Movie NFT Marketplace
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Buy, sell, and collect exclusive movie NFTs. Own a piece of cinematic history.
            </p>
            {!active && (
              <button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-primary/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-primary/50 hover:bg-primary/30 transition-colors"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                    Connecting...
                  </>
                ) : (
                  'Connect Wallet to Start Trading'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="sticky top-16 z-30 bg-dark/80 backdrop-blur-sm py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    filter === category.id 
                      ? 'bg-primary text-white' 
                      : 'bg-dark-lighter hover:bg-dark-light'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-lighter rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNFTs.map(nft => (
            <MovieCard
              key={nft.id}
              nft={nft}
              isOwner={account && nft.owner === account}
            />
          ))}
        </div>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-24">
            <div className="bg-dark-lighter rounded-2xl p-8 max-w-md mx-auto">
              <FaSearch className="text-4xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">No NFTs Found</p>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace; 