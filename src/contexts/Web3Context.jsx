import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../config/web3.config';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const { active, account, library, activate, deactivate, chainId } = useWeb3React();
  const [isLoading, setIsLoading] = useState(true);

  // Try to connect to previously connected wallet
  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (window.localStorage.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected);
        } catch (error) {
          console.error('Error on auto connect:', error);
        }
      }
      setIsLoading(false);
    };
    connectWalletOnPageLoad();
  }, [activate]);

  const connectWallet = async () => {
    try {
      await activate(injected);
      window.localStorage.setItem('isWalletConnected', 'true');
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    try {
      deactivate();
      window.localStorage.setItem('isWalletConnected', 'false');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        isLoading,
        active,
        account,
        library,
        chainId,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}; 