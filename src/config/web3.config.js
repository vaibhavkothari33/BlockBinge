import { InjectedConnector } from '@web3-react/injected-connector';

export const SUPPORTED_CHAIN_IDS = [1, 3, 4, 5, 42, 137, 80001]; // Including Polygon networks

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS
});

export const getNetworkName = (chainId) => {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 3:
      return 'Ropsten';
    case 4:
      return 'Rinkeby';
    case 5:
      return 'Goerli';
    case 42:
      return 'Kovan';
    case 137:
      return 'Polygon Mainnet';
    case 80001:
      return 'Polygon Mumbai';
    default:
      return 'Unknown Network';
  }
}; 