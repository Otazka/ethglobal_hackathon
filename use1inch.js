import { useState } from 'react';
import { ethers } from 'ethers';

export const use1inch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'https://api.1inch.dev';
  const CHAIN_ID = 1; // Ethereum mainnet

  // Get supported tokens
  const getSupportedTokens = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/swap/v6.0/${CHAIN_ID}/tokens`);
      if (!response.ok) throw new Error('Failed to fetch tokens');
      const data = await response.json();
      return data.tokens;
    } catch (error) {
      console.error('Error fetching tokens:', error);
      throw error;
    }
  };

  // Get quote for swap
  const getSwapQuote = async (fromToken, toToken, amount) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        src: fromToken,
        dst: toToken,
        amount: amount,
      });

      const response = await fetch(`${API_BASE_URL}/swap/v6.0/${CHAIN_ID}/quote?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.description || 'Failed to get quote');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting quote:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get swap transaction data
  const getSwapTransaction = async (fromToken, toToken, amount, fromAddress, slippage = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        src: fromToken,
        dst: toToken,
        amount: amount,
        from: fromAddress,
        slippage: slippage,
        disableEstimate: true,
      });

      const response = await fetch(`${API_BASE_URL}/swap/v6.0/${CHAIN_ID}/swap?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.description || 'Failed to get swap transaction');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting swap transaction:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Execute swap using Fusion+
  const executeFusionSwap = async (signer, fromToken, toToken, amount, slippage = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const fromAddress = await signer.getAddress();
      
      // Get swap transaction data
      const swapData = await getSwapTransaction(fromToken, toToken, amount, fromAddress, slippage);
      
      // Execute the transaction
      const tx = await signer.sendTransaction({
        to: swapData.tx.to,
        data: swapData.tx.data,
        value: swapData.tx.value || '0',
        gasLimit: swapData.tx.gas,
      });

      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error executing swap:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get token allowance
  const getTokenAllowance = async (provider, tokenAddress, ownerAddress, spenderAddress) => {
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function allowance(address owner, address spender) view returns (uint256)'],
        provider
      );

      const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
      return allowance;
    } catch (error) {
      console.error('Error getting allowance:', error);
      throw error;
    }
  };

  // Approve token spending
  const approveToken = async (signer, tokenAddress, spenderAddress, amount) => {
    try {
      setIsLoading(true);
      setError(null);

      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function approve(address spender, uint256 amount) returns (bool)'],
        signer
      );

      const tx = await tokenContract.approve(spenderAddress, amount);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error approving token:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get token balance
  const getTokenBalance = async (provider, tokenAddress, userAddress) => {
    try {
      if (tokenAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        // ETH balance
        const balance = await provider.getBalance(userAddress);
        return balance;
      } else {
        // ERC20 token balance
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ['function balanceOf(address account) view returns (uint256)'],
          provider
        );

        const balance = await tokenContract.balanceOf(userAddress);
        return balance;
      }
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  };

  // Common tokens on Ethereum
  const COMMON_TOKENS = {
    ETH: {
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
    },
    USDC: {
      address: '0xa0b86a33e6441e6c5e8b0b5b4b6b5b4b6b5b4b6b',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logoURI: 'https://tokens.1inch.io/0xa0b86a33e6441e6c5e8b0b5b4b6b5b4b6b5b4b6b.png',
    },
    USDT: {
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    },
    DAI: {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
    },
  };

  return {
    isLoading,
    error,
    getSupportedTokens,
    getSwapQuote,
    getSwapTransaction,
    executeFusionSwap,
    getTokenAllowance,
    approveToken,
    getTokenBalance,
    COMMON_TOKENS,
  };
};

