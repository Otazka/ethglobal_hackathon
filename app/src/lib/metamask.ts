import { MetaMaskSDK } from '@metamask/sdk';

export const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: 'Telegram Mini App',
    url: window.location.href,
  },
  injectProvider: true,
  communicationLayerPreference: 'webrtc', // fallback to iframe on unsupported
});