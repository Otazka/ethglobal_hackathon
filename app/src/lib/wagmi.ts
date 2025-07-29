import { configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { injected } from 'wagmi/connectors';

import { MMSDK } from './metamask';

const provider = MMSDK.getProvider();

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    injected({ shimDisconnect: true }),
  ],
  publicClient: provider,
});