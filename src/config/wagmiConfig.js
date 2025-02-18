import { createConfig, http } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { metaMask, walletConnect } from 'wagmi/connectors'

// Custom storage
const customStorage = {
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
  removeItem: (key) => window.localStorage.removeItem(key),
};

// Set up wagmi config
export const config = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [metaMask(), walletConnect({
    isNewChainsStale: true,
    projectId: '571f5e3e8ec5570d84fb07c48fc4fdb3',
    showQrModal: true,
  }),],
  storage: customStorage,
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
});
