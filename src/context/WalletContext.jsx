import React, { createContext, useContext, useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../utils/connectors';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { activate, active, account, deactivate } = useWeb3React();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to connect.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Switch to Sepolia testnet
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
        });
      } catch (switchError) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/demo'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            });
          } catch (addError) {
            throw new Error('Failed to add Sepolia network');
          }
        } else {
          throw switchError;
        }
      }

      // Activate Web3React with injected provider
      await activate(injected);
      localStorage.setItem('walletConnected', 'true');
    } catch (error) {
      console.error('Connection error:', error);
      if (error.code === 4001) {
        setError('Please accept the connection request in MetaMask.');
      } else if (error.code === -32002) {
        setError('Please open MetaMask and accept the connection request.');
      } else {
        setError(error.message || 'Failed to connect wallet.');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [activate]);

  const disconnectWallet = useCallback(() => {
    try {
      deactivate();
      localStorage.removeItem('walletConnected');
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }, [deactivate]);

  // Auto-connect if previously connected
  React.useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected') === 'true';
    if (wasConnected && !active && window.ethereum) {
      connectWallet();
    }
  }, [connectWallet, active]);

  // Handle account and chain changes
  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      window.ethereum.on('disconnect', () => {
        disconnectWallet();
      });

      return () => {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
        window.ethereum.removeAllListeners('disconnect');
      };
    }
  }, [disconnectWallet]);

  return (
    <WalletContext.Provider value={{
      active,
      account,
      isConnecting,
      error,
      connectWallet,
      disconnectWallet,
      setError
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 