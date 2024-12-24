import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";

const client = createPublicClient({ transport: http(), chain: polygon });

export async function getTransactionReceipt(hash) {
  var status = await client.waitForTransactionReceipt({ hash });
  return status;
}
