// import { ethers } from 'ethers';
// import StreamingPlatform from '../../artifacts/contracts/StreamingPlatform.sol/StreamingPlatform.json';
// const contract = CreateContract();

// export const CreateContract = () => {

//   const provider = new ethers.providers.Web3Provider(window.ethereum);

//   const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
//   const signer = provider.getSigner();
//   return new ethers.Contract(contractAddress, StreamingPlatform.abi, signer);

//   function startStream(movieId) {

//     contract.startStream(movieId);
//   }

//   function pauseStream() {
//     contract.pauseStream();
//   }

//   function verifyPayment() {
//     contract.verifyPayment();
//   }
  
 

// };

import { ethers } from 'ethers';
import StreamingPlatform from '../../artifacts/contracts/StreamingPlatform.sol/StreamingPlatform.json';

export const CreateContract = () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask to use this feature");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, StreamingPlatform.abi, signer);
};

const contract = CreateContract();

function startStream(movieId) {
    try {
        // Ensure movieId is within valid range
        if (movieId < 0 || movieId > 3) {
        throw new Error("Invalid movie ID. Must be between 0 and 3");
        }
        // Convert movie.id to match contract expectations
        const contractMovieId = Number(movieId);
        // const tx =  contract.startStream(contractMovieId);
        const tx =  contract.startStream(contractMovieId, { gasLimit: 500000 });
// await tx.wait();

    } catch (error) {
        console.error("Error in startStream:", error);
        throw error;
    }
}
async function pauseStream() {
    try {
        const tx = await contract.pauseStream();
        await tx.wait();
    } catch (error) {
        console.error("Error in pauseStream:", error);
        throw error;
    }
}
   
    // pauseStream: async () => {
    //   try {
    //     const tx = await contract.pauseStream();
    //     await tx.wait();
    //     return tx;
    //   } catch (error) {
    //     console.error("Error in pauseStream:", error);
    //     throw error;
    //   }
    // },

    // verifyPayment: async () => {
    //   try {
    //     const tx = await contract.verifyPayment();
    //     await tx.wait();
    //     return tx;
    //   } catch (error) {
    //     console.error("Error in verifyPayment:", error);
    //     throw error;
    //   }
    // }
//   };

export { startStream, pauseStream };
// startstream
// Pause
// PENDING PaymentResponse
// verifyPayment
// startverification

// export const getContract = (provider) => {
//   const signer = provider.getSigner();
//   return new ethers.Contract(contractAddress, MovieNFT.abi, signer);
// };