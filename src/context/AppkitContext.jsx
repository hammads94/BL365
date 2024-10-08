import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";
import { arbitrum, baseSepolia, mainnet } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";


const queryClient = new QueryClient();

const projectId = "2749129932e95ebbfd9fb027e716a1c4";

const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://example.com",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

const network = {
  id: 'eip155:31337',
  chainId: 31337,
  name: 'Anvil',
  currency: 'ETH',
  explorerUrl: '',
  rpcUrl: 'http://127.0.0.1:8545',
  chainNamespace: 'eip155',
}


const networks = [network];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, 
    email:false,
    socials:false
  },
  themeVariables:{
    '--w3m-font-family': 'Ox',
    '--w3m-accent':'#eb9534',
  }
});

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
