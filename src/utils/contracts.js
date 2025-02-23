import { ethers } from 'ethers';
import StreamingPlatform from '../../artifacts/contracts/StreamingPlatform.sol/StreamingPlatform.json';

export const CreateContract = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask to use this feature");
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

    const contract = new ethers.Contract(
      contractAddress,
      StreamingPlatform.abi,
      signer
    );

    // Debug log to check available functions
    console.log('Available contract functions:', Object.keys(contract.functions));
    return contract;
  } catch (error) {
    return { error: error.message || "Failed to create contract" };
  }
};

// Helper function to check if the result is an error
export const isContractError = (result) => {
  return result && result.error !== undefined;
};

export const checkPendingPayments = async () => {
  try {
    const contract = await CreateContract();
    if (isContractError(contract)) {
      throw new Error(contract.error);
    }

    const userAddress = await contract.signer.getAddress();
    const pendingPayment = await contract.pendingPayments(userAddress);
    
    return {
      hasPendingPayment: pendingPayment.gt(0),
      amount: ethers.utils.formatEther(pendingPayment)
    };
  } catch (error) {
    console.error("Error checking pending payments:", error);
    throw error;
  }
};

export const billSession = async (contentId, time) => {
  try {
    const contract = await CreateContract();
    if (isContractError(contract)) {
      throw new Error(contract.error);
    }

    // Convert time to minutes and calculate cost
    const timeInMinutes = Math.ceil(time / 60);
    const costInEth = (timeInMinutes * 0.001).toFixed(4);
    
    console.log(`Processing final bill for content ${contentId}, time: ${timeInMinutes} minutes, cost: ${costInEth} ETH`);

    try {
      // Process the payment directly without addPendingPayment
      const tx = await contract.processPayment(contentId, {
        value: ethers.utils.parseEther(costInEth.toString()),
        gasLimit: 500000
      });

      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        console.log("Payment processed successfully");
        return {
          success: true,
          cost: costInEth,
          timeInMinutes,
          transactionHash: receipt.transactionHash,
          paid: true
        };
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      if (error.code === 'ACTION_REJECTED') {
        return {
          success: false,
          cost: costInEth,
          timeInMinutes,
          error: 'Transaction was rejected by user',
          paid: false
        };
      }
      if (error.code === 'INSUFFICIENT_FUNDS') {
        return {
          success: false,
          cost: costInEth,
          timeInMinutes,
          error: 'Insufficient funds in wallet',
          paid: false
        };
      }
      return {
        success: false,
        cost: costInEth,
        timeInMinutes,
        error: error.message,
        paid: false
      };
    }
  } catch (error) {
    console.error("Error in billSession:", error);
    throw new Error(`Payment failed: ${error.message}`);
  }
};

export const handlePendingPayment = async () => {
  try {
    const contract = await CreateContract();
    if (isContractError(contract)) {
      throw new Error(contract.error);
    }

    // Get user's address and pending amount
    const userAddress = await contract.signer.getAddress();
    const pendingAmount = await contract.pendingPayments(userAddress);

    if (pendingAmount.gt(0)) {
      console.log("Processing pending payment of:", ethers.utils.formatEther(pendingAmount), "ETH");
      
      // Use verifyPayment with the exact pending amount
      const tx = await contract.verifyPayment({ 
        value: pendingAmount,
        gasLimit: 500000
      });
      
      const receipt = await tx.wait();
      
      // Check if transaction was successful without relying on events
      if (receipt.status === 1) {
        console.log("Payment verified successfully");
        console.log("Transaction hash:", receipt.transactionHash);
        console.log("Paid amount:", ethers.utils.formatEther(pendingAmount), "ETH");

        // Double check if pending payment was cleared
        const newPendingAmount = await contract.pendingPayments(userAddress);
        if (newPendingAmount.isZero()) {
          return true;
        }
      }

      // Check remaining balance after transaction
      const remainingBalance = await contract.pendingPayments(userAddress);
      if (remainingBalance.isZero()) {
        console.log("Payment verified - pending balance is zero");
        return true;
      }

      console.log("Payment verification failed - pending balance remains");
      return false;
    }
    return false;
  } catch (error) {
    console.error("Error handling pending payment:", error);
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('Transaction was rejected by user');
    }
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient funds in wallet');
    }
    throw error;
  }
};

// Debug function to help identify available contract functions
export const debugContractFunctions = async () => {
  try {
    const contract = await CreateContract();
    if (isContractError(contract)) {
      console.log("Contract address:", contract.address);
      console.log("Available functions:", Object.keys(contract.functions));
      return Object.keys(contract.functions);
    }
  } catch (error) {
    console.error("Debug error:", error);
    return [];
  }
};

// Add a debug function to check contract functions
export const debugPaymentFunctions = async () => {
  try {
    const contract = await CreateContract();
    if (isContractError(contract)) {
      return [];
    }
    const functions = Object.keys(contract.functions);
    console.log("All contract functions:", functions);
    const payableFunctions = functions.filter(
      name => name.toLowerCase().includes('payment') || 
             name.toLowerCase().includes('pay') ||
             name.toLowerCase().includes('bill')
    );
    console.log("Available payment functions:", payableFunctions);
    return payableFunctions;
  } catch (error) {
    console.error("Debug error:", error);
    return [];
  }
};

// Process payment function
export const processPayment = async (contentId, amount) => {
  try {
    const contract = await CreateContract();
    if (isContractError(contract)) {
      throw new Error(contract.error);
    }

    const tx = await contract.processPayment(contentId, {
      value: ethers.utils.parseEther(amount.toString()),
      gasLimit: 500000
    });
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error in processPayment:", error);
    throw error;
  }
};

// Debug function
export const debugContract = async () => {
  try {
    const contract = await CreateContract();
    if (isContractError(contract)) {
      console.error("Contract creation error:", contract.error);
      return;
    }
    console.log("Contract address:", contract.address);
    console.log("Available functions:", Object.keys(contract.functions));
    return Object.keys(contract.functions);
  } catch (error) {
    console.error("Debug error:", error);
  }
};
