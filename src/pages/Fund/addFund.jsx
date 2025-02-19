import React,{useState} from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import "./fund.css";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits } from "viem";
import { abi } from "../../ABI/usdtAbi";
import { toast } from "react-hot-toast";

const USDT_ADDRESS = "0x7B5E2af1a89a1a23D8031077a24A2454D81b3fbd";

const AddFund = () => {
  const { address } = useAccount();
  console.log("address: " + address);
  const [recipient, setRecipient] = useState("");
  // const [amount, setAmount] = useState("");

  const {
    writeContract,
    data: hash,
    status,
    variables,
    writeContractAsync,
  } = useWriteContract();

  const amount = 1 * 10 ** 18;
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  console.log("data", hash);

  return (
    <>
      <MasterLayout>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Send USDT</h2>
          <input
            type="text"
            placeholder="Recipient Address"
            className="border p-2 rounded w-full mb-2"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          {/* <input
        type="text"
        placeholder="Amount"
        className="border p-2 rounded w-full mb-2"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      /> */}
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={() =>
              writeContractAsync({
                abi,
                address: USDT_ADDRESS,
                functionName: "transfer",
                args: ["0x3Ca63F13dfDC749Cc5565c4Ab9b00657e1b4f379", amount],
              })
            }
            // disabled={isLoading}
          >
            {/* {isLoading ? "Sending..." : "Send USDT"} */}
            send USDT
          </button>
          {hash && <div>Transaction Hash: {hash}</div>}
          {isConfirming && <div>Waiting for confirmation...</div>}
          {isConfirmed && <div>Transaction confirmed.</div>}

          {/* {isSuccess && <p>Transaction Hash: {data?.hash}</p>}
      {writeError && (
        <p className="text-red-500">Error: {writeError?.message}</p>
      )} */}
        </div>

        <div className="add_fund_sec">
          <form className="fund-form">
            <input
              type="text"
              placeholder="Enter Amount in USDT"
              className="input-field"
            />
            <select name="fund-option" className="select-field">
              <option value="USDT(BEP20)">USDT (BEP20)</option>
            </select>
            <button className="connect-wallet-btn">Connect Wallet</button>
          </form>
        </div>
      </MasterLayout>
    </>
  );
};

export default AddFund;
