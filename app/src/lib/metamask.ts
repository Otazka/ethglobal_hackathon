import { MetaMaskSDK } from '@metamask/sdk';

export const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: 'Telegram Mini App',
    url: window.location.href,
  },
  injectProvider: true,
});