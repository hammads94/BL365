import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { anvil, baseSepolia, polygon } from "viem/chains";


const queryClient = new QueryClient();

const projectId = "2749129932e95ebbfd9fb027e716a1c4";

const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://example.com",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

const networks = [baseSepolia];

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
  themeMode:'dark',
  themeVariables:{
    '--w3m-font-family': 'Ox',
    '--w3m-accent':'#eb9534',
    '--w3m-color-mix':'#fff'
  }
});

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
