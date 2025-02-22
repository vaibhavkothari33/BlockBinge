import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 137, 80001, 11155111],
  timeout: 20000 // 20 seconds
});

// Network configurations
export const NETWORKS = {
  11155111: {
    chainId: '0x' + Number(11155111).toString(16),
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'Sepolia ETH',
      symbol: 'SEP',
      decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/your-project-id'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  }
}; 