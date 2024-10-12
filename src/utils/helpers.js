import { createPublicClient, http } from "viem";
import { anvil, baseSepolia, bscTestnet, polygon } from "viem/chains";

const client = createPublicClient({ transport: http(), chain: baseSepolia });

export async function getTransactionReceipt(hash) {
  var status = await client.waitForTransactionReceipt({ hash });
  return status;
}
