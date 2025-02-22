import { ethers } from 'ethers';
import MovieNFT from '../../artifacts/contracts/MovieNFT.sol/MovieNFT.json';

const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';

export const getContract = (provider) => {
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, MovieNFT.abi, signer);
};