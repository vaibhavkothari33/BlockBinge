import React, { useState } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { getContract } from '../../utils/contract';
import { useLoader } from '../../contexts/LoaderContext';

const MovieCard = ({ nft, isOwner }) => {
  const { active, library } = useWeb3React();
  const { setIsLoading } = useLoader();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuy = async () => {
    if (!active) return;
    setIsProcessing(true);
    setIsLoading(true);
    
    try {
      const contract = getContract(library);
      const tx = await contract.buyMovie(nft.tokenId, { 
        value: ethers.utils.parseEther(nft.price.toString()) 
      });
      await tx.wait();
      console.log('NFT bought:', nft.tokenId);
    } catch (error) {
      console.error('Error buying NFT:', error);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const handleSell = async () => {
    if (!active) return;
    setIsProcessing(true);
    setIsLoading(true);
    
    try {
      const contract = getContract(library);
      const tx = await contract.listMovie(
        nft.tokenId, 
        ethers.utils.parseEther(nft.price.toString())
      );
      await tx.wait();
      console.log('NFT listed for sale:', nft.tokenId);
    } catch (error) {
      console.error('Error listing NFT for sale:', error);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-dark-lighter rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
      <div className="relative aspect-[2/3]">
        <img
          src={nft.image}
          alt={nft.title}
          className="w-full h-full object-cover"
        />
        {nft.forSale && (
          <div className="absolute top-2 right-2 bg-primary px-2 py-1 rounded text-sm font-semibold">
            For Sale
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{nft.title}</h3>
        <div className="flex items-center gap-2 text-primary mb-4">
          <FaEthereum />
          <span className="font-medium">{nft.price} ETH</span>
        </div>
        
        {active ? (
          isOwner ? (
            <button
              onClick={handleSell}
              disabled={isProcessing}
              className={`w-full ${
                isProcessing 
                  ? 'bg-primary/20 cursor-not-allowed' 
                  : 'bg-primary/20 hover:bg-primary/30'
              } text-primary py-2 rounded-lg transition-colors`}
            >
              {isProcessing ? 'Processing...' : nft.forSale ? 'Update Price' : 'Sell NFT'}
            </button>
          ) : (
            nft.forSale && (
              <button
                onClick={handleBuy}
                disabled={isProcessing}
                className={`w-full ${
                  isProcessing 
                    ? 'bg-primary/50 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary/90'
                } py-2 rounded-lg transition-colors`}
              >
                {isProcessing ? 'Processing...' : 'Buy Now'}
              </button>
            )
          )
        ) : (
          <button
            className="w-full bg-gray-500/50 py-2 rounded-lg cursor-not-allowed"
            disabled
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;