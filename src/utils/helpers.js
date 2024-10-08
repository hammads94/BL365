import { createPublicClient, http } from "viem";
import { anvil } from "viem/chains";

const client = createPublicClient({ transport: http(), chain: anvil });

export async function getTransactionReceipt(hash) {
  var status = await client.waitForTransactionReceipt({ hash });
  return status;
}
