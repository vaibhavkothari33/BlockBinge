import React, { useState } from 'react';
import { FaTimes, FaEthereum, FaStar, FaClock, FaVideo, FaWallet, FaPlay } from 'react-icons/fa';
import { useWeb3React } from '@web3-react/core';
import { useLoader } from '../contexts/LoaderContext';
import { getContract } from '../utils/contract';
import { ethers } from 'ethers';
import VideoPlayer from './VideoPlayer/VideoPlayer';

const MovieSlug = ({ movie, onClose }) => {
  const { active, library } = useWeb3React();
  const { setIsLoading } = useLoader();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isWatching, setIsWatching] = useState(false);

  const handleBuy = async () => {
    if (!active) return;
    setIsProcessing(true);
    setIsLoading(true);
    
    try {
      const contract = getContract(library);
      const tx = await contract.buyNFT(movie.tokenId, { 
        value: ethers.utils.parseEther(movie.price.toString()) 
      });
      await tx.wait();
      console.log('NFT bought:', movie.tokenId);
      onClose();
    } catch (error) {
      console.error('Error buying NFT:', error);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  if (isWatching) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <button
          onClick={() => setIsWatching(false)}
          className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all"
        >
          <FaTimes className="text-xl" />
        </button>
        <div className="h-full flex items-center justify-center">
          <VideoPlayer
            playbackId={movie.playbackId}
            title={movie.title}
            poster={movie.image}
            movie={movie}
          />
        </div>
      </div>
    );
  }

  const canWatch = movie.isOwner || !movie.forSale;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="relative max-w-6xl mx-auto bg-dark-lighter rounded-2xl overflow-hidden shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all"
          >
            <FaTimes className="text-xl" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Movie Poster */}
            <div className="relative aspect-[2/3] lg:aspect-auto group cursor-pointer">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-lighter via-transparent to-transparent" />
              
              {/* Movie Stats */}
              <div className="absolute text-white top-4 left-4 flex gap-3">
                {movie.imdb && (
                  <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <FaStar className="text-base" />
                    <span className="text-base">{movie.imdb}</span>
                  </div>
                )}
                {movie.forSale && (
                  <div className="bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold">
                    For Sale
                  </div>
                )}
              </div>

              {/* Watch Button Overlay */}
              {canWatch && (
                <div 
                  onClick={() => setIsWatching(true)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                >
                  <div className="transform scale-90 group-hover:scale-100 transition-all duration-300 text-center">
                    <div className="w-20 h-20 mx-auto bg-primary/90 rounded-full flex items-center justify-center mb-4">
                      <FaPlay className="text-3xl ml-2" />
                    </div>
                    <span className="text-xl font-medium">Watch Now</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Movie Details */}
            <div className="p-8 lg:p-12">
              <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                {movie.genre && movie.genre.split(',').map((genre, index) => (
                  <span key={index} className="bg-dark/50 px-3 py-1 rounded-full border border-white/10">
                    {genre.trim()}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 mb-8 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <FaClock className="text-primary" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FaVideo className="text-primary" />
                  <span>Movie NFT</span>
                </div>
              </div>

              <p className="text-gray-300 mb-8 leading-relaxed">
                {movie.description}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400 py-3 border-b border-white/10">
                  <span>Token ID</span>
                  <span className="text-white font-medium">#{movie.tokenId}</span>
                </div>
                <div className="flex justify-between text-gray-400 py-3 border-b border-white/10">
                  <span>Owner</span>
                  <span className="text-white font-medium">{movie.owner}</span>
                </div>
                <div className="flex justify-between text-gray-400 py-3 border-b border-white/10">
                  <span>Price</span>
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <FaEthereum className="text-xl" />
                    <span className="text-lg">{movie.price} ETH</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {active ? (
                  canWatch ? (
                    <button
                      onClick={() => setIsWatching(true)}
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 py-4 rounded-xl font-medium transition-all"
                    >
                      <FaPlay className="text-lg" />
                      <span>Watch Now</span>
                    </button>
                  ) : (
                    movie.forSale && (
                      <button
                        onClick={handleBuy}
                        disabled={isProcessing}
                        className={`w-full flex items-center justify-center gap-2 ${
                          isProcessing 
                            ? 'bg-primary/50 cursor-not-allowed' 
                            : 'bg-primary hover:bg-primary/90'
                        } py-4 rounded-xl transition-all font-medium`}
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <FaWallet className="text-lg" />
                            <span>Buy Now for {movie.price} ETH</span>
                          </>
                        )}
                      </button>
                    )
                  )
                ) : (
                  <button
                    className="w-full bg-gray-500/20 border border-gray-500/30 text-gray-400 py-4 rounded-xl cursor-not-allowed font-medium"
                    disabled
                  >
                    Connect Wallet to Access
                  </button>
                )}

                {canWatch && (
                  <p className="text-center text-green-400 text-sm">
                    {movie.isOwner ? "You own this movie" : "This movie is available to watch"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieSlug; 