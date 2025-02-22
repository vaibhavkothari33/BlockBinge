import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected, NETWORKS } from '../utils/connectors';
import { FaEthereum } from 'react-icons/fa';

const WalletConnect = () => {
  const { activate, active, deactivate, chainId } = useWeb3React();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Handle chain changed
    const handleChainChanged = (chainId) => {
      console.log("Chain changed to:", chainId);
      window.location.reload();
    };

    // Handle account changed
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        deactivate();
      }
    };

    // Handle disconnect
    const handleDisconnect = () => {
      deactivate();
    };

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [deactivate]);

  const switchToSepolia = async () => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORKS[11155111].chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORKS[11155111]],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          setError('Failed to add network. Please try again.');
        }
      } else {
        console.error('Error switching network:', switchError);
        setError('Failed to switch network. Please try again.');
      }
    }
  };

  const connectWallet = async () => {
    setError(null);
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask to connect your wallet');
        return;
      }

      // Request account access
      await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      // Switch to Sepolia if not already on it
      if (chainId !== 11155111) {
        await switchToSepolia();
      }

      // Activate the Web3 connection
      await activate(injected, undefined, true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet. Please try again.');
    }
  };

  const disconnectWallet = async () => {
    try {
      deactivate();
      if (window.ethereum) {
        // Clear any cached provider data
        window.ethereum.removeAllListeners();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <div className="relative">
      {error && (
        <div className="absolute bottom-full mb-2 w-48 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {active ? (
        <button
          onClick={disconnectWallet}
          className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full hover:bg-green-500/30 transition-colors"
        >
          <FaEthereum />
          <span>Connected</span>
        </button>
      ) : (
        <button
          onClick={connectWallet}
          className="flex items-center gap-2 bg-primary px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <FaEthereum />
          <span>Connect Wallet</span>
        </button>
      )}
    </div>
  );
};

export default WalletConnect; 