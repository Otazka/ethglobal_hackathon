import { createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { createPublicClient, http } from 'viem';

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});