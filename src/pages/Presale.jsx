import blLogo from "/logo.png";
import blTokenLogo from "/token.png";
import bnblogo from "/bnb.png";
import { useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { ArrowDownIcon, WalletIcon } from "@heroicons/react/16/solid";
import { presaleContract, tokenContract } from "../utils/constants";
import { formatEther, formatUnits, parseEther } from "viem";
import { getTransactionReceipt } from "../utils/helpers";
import toast from "react-hot-toast";

const Presale = () => {
  const { isConnected, address } = useAccount();
  const [exchangeInfo, setExchangeInfo] = useState({
    value: "...",
    conversion: "...",
  });
  const { writeContract } = useWriteContract();

  const { data: sold } = useReadContract({
    ...presaleContract,
    functionName: "tokensSold",
  });

  const { data: tokenPrice } = useReadContract({
    ...presaleContract,
    functionName: "tokenPerPrice",
  });

  const { data: tokenBalance, refetch } = useReadContract({
    ...tokenContract,
    functionName: "balanceOf",
    args: [address],
  });

  function buy() {
    writeContract(
      {
        ...presaleContract,
        functionName: "buyTokens",
        args: [exchangeInfo?.conversion.toString()],
        value: parseEther(exchangeInfo?.value.toString()),
      },
      {
        onError: (e) => {
          console.log(e);
          // handle errors
        },
        onSuccess: async (hash) => {
          let res = await getTransactionReceipt(hash);
          if (res.status === "success") {
            toast.success("Tokens bought successfully!");
            refetch();
            refetchNative();
          } else {
            toast.error("Transaction failed!");
          }
        },
      }
    );
  }

  const { data: balance, refetch: refetchNative } = useBalance({
    address: address,
    chainId: 31337,
  });

  function formatSold(sold) {
    if (sold === undefined) {
      return "...";
    }
    if (sold.length < 0 || sold === 0n) {
      return 0;
    }
    if (soldString.length >= 7 && soldString.length < 10) {
      sold = Math.round(sold / Math.pow(10, 6 - 2)) / 100;
      return sold + " Million";
    }
    if (soldString.length >= 10 && supplysoldStringString.length < 13) {
      sold = Math.round(sold / Math.pow(10, 9 - 2)) / 100;
      console.log(sold);
      return sold + " Billion";
    }
  }

  function onChange(e) {
    var value = e.target.value;
    try {
      value = parseFloat(value);
      if (!isNaN(value)) {
        setExchangeInfo({
          conversion: Math.round(value / parseFloat(formatEther(tokenPrice))),
          value: value,
        });
      } else {
        setExchangeInfo({ value: "...", conversion: "..." });
      }
    } catch {
      setExchangeInfo({ value: "...", conversion: "..." });
    }
  }

  return (
    <div className="relative bg-[#f5f5f518] h-[500px] w-[450px] flex flex-col items-center justify-center border-4 rounded-2xl border-[#e3ba34] shadow-yellow-400 shadow-[0_0_20px_1px_rgba(0,0,0,0.25),inset_0_0_10px_1px_rgba(0,0,0,0.4)] ">
      {isConnected ?? (
        <div className="walletIndicator">
          <WalletIcon />
          <text
            style={{
              marginLeft: "5px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontFamily: "Helv",
            }}
          >
            {address}
          </text>
        </div>
      )}
      <div className="absolute top-[-40px]">
        <img src={blLogo} className="h-[120px]" />
        <h1 className="absolute right-[-20px] text-nowrap font-bold">
          PRESALE
        </h1>
      </div>
      {!isConnected ? (
        <div className="flex flex-col">
          <h1 className="text-xl text-center">
            {formatSold(sold)} out of 10 Billion{" "}
            <strong className="font-ox">BL356</strong> Tokens Sold!
          </h1>
          <div className="flex justify-center absolute bottom-10 inset-x-0 m-auto">
            <w3m-button />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-[80%]">
          <div className="rounded-2xl px-4 py-2 text-center gap-y-2 flex flex-col bg-[#e85d0da6] shadow-red-800 shadow-[0_0_20px_1px_rgba(0,0,0,0.25)]">
            <p className="font-ox">
              Balance:{" "}
              {balance !== undefined
                ? parseFloat(
                    formatUnits(balance?.value, balance?.decimals)
                  ).toFixed(2)
                : "..."}
            </p>
            <div className="flex justify-between">
              <input
                id="valueBNB"
                type="number"
                placeholder="0.0"
                className="rounded-sm p-2 bg-transparent text-white placeholder:text-white/70 border-b-4 border-[#982B1C] appearance-none "
                onChange={(e) => {
                  onChange(e);
                }}
              ></input>
              <div className="flex gap-2 items-center font-ox">
                <img className="h-6" src={bnblogo} />
                <>BNB</>
              </div>
            </div>
          </div>
          <ArrowDownIcon className="h-6" />
          <div className="rounded-2xl px-4 py-2 text-center gap-y-2 flex flex-col  bg-[#e85d0da6] shadow-red-800 shadow-[0_0_20px_1px_rgba(0,0,0,0.25)]">
            <p className="font-ox">
              Balance: {tokenBalance && formatEther(tokenBalance)}
            </p>
            <div className="flex justify-between">
              <input
                id="valueBNB"
                type="number"
                placeholder="0.0"
                className="rounded-sm p-2 bg-transparent text-white placeholder:text-white/70 border-b-4 border-[#982B1C] appearance-none"
                value={exchangeInfo.conversion}
              ></input>
              <div className="flex gap-2 items-center font-ox">
                <img className="h-6" src={blTokenLogo} />
                <>BL365</>
              </div>
            </div>
          </div>

          <button
            onClick={buy}
            className="font-ox bg-yellow-500 p-2 absolute bottom-10 m-auto left-0 right-0 w-20 rounded-xl shadow-yellow-600 shadow-[0_0_20px_1px_rgba(0,0,0,0.25)]"
          >
            Buy
          </button>
        </div>
      )}
    </div>
  );
};
export default Presale;
