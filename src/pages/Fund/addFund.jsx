import React, { useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { FaRegCreditCard } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaDollarSign } from "react-icons/fa";
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
  const [selectedToken, setSelectedToken] = useState("USDC");
  const { address } = useAccount();
  console.log("address: " + address);
  const [recipient, setRecipient] = useState("");
  // const [amount, setAmount] = useState("");
  const [amountInput, setAmountInput] = useState("");

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

        <div className="payment-container">
          <select className="payment-dropdown">
            <option>Direct Payment</option>
            <option>Bank Transfer</option>
          </select>

          <div className="payment-box">
            <label>User Name or Wallet Address</label>
            <input
              type="text"
              placeholder="Enter username or wallet"
              className="input-field"
            />

            <div className="amount-section">
              <div className="amount-input">
                <label>Amount</label>
                <input
                  type="text"
                  placeholder="0.00"
                  className="input-field"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                />
              </div>

              <div className="token-select">
                <label className="d-flex justify-content-between">
                  Token <span className="balance">Balance: 0.00</span>
                </label>
                <div className="token-dropdown">
                  <FaDollarSign className="token-icon" />
                  <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                  >
                    <option value="token">Token Select</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>
              </div>
            </div>

            <button className={`submit-btn ${amountInput ? "active-btn" : ""}`}>
              Enter Detail
            </button>
          </div>
        </div>
      </MasterLayout>
    </>
  );
};

export default AddFund;
