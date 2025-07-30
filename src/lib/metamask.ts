import { MetaMaskSDK } from '@metamask/sdk';

export const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: 'Your Dapp Name',
    url: window.location.origin,
  },
  injectProvider: true,
});

export const getMetaMaskProvider = () => MMSDK.getProvider();