import { MetaMaskSDK } from '@metamask/sdk';

// Initialize MetaMask SDK
export const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: 'Cross-Chain Wallet',
    url: window.location.origin,
  },
  injectProvider: true,
});

// Get MetaMask provider with fallback
export const getMetaMaskProvider = () => {
  try {
    // Try SDK first
    const sdkProvider = MMSDK.getProvider();
    if (sdkProvider && typeof sdkProvider.request === 'function') {
      return sdkProvider;
    }
    
    // Fallback to direct window.ethereum access (like FusionSwap)
    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting MetaMask provider:', error);
    return null;
  }
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && window.ethereum !== undefined;
};

// Check if MetaMask is connected
export const isMetaMaskConnected = async () => {
  try {
    const provider = getMetaMaskProvider();
    if (!provider) return false;
    
    const accounts = await provider.request({ method: 'eth_accounts' });
    return accounts && accounts.length > 0;
  } catch (error) {
    console.error('Error checking MetaMask connection:', error);
    return false;
  }
};

// Get current account
export const getCurrentAccount = async () => {
  try {
    const provider = getMetaMaskProvider();
    if (!provider) return null;
    
    const accounts = await provider.request({ method: 'eth_accounts' });
    return accounts && accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

// Get network ID
export const getNetworkId = async () => {
  try {
    const provider = getMetaMaskProvider();
    if (!provider) return null;
    
    const networkId = await provider.request({ method: 'net_version' });
    return networkId;
  } catch (error) {
    console.error('Error getting network ID:', error);
    return null;
  }
};