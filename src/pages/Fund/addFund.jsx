import React, { useState, useEffect, useRef } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { FaDollarSign } from "react-icons/fa";
import "./fund.css";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useChainId,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { abi } from "../../ABI/usdtAbi";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { verifyTransactionAsync } from "../../feature/transaction/transactionSlice";
import { getWalletBalance } from "../../utils/walletUtils";
import { getTokens } from "../../utils/tokens";

const AddFund = () => {
  const dispatch = useDispatch();
  const [selectedToken, setSelectedToken] = useState("token");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const [isMetaMaskOpen, setIsMetaMaskOpen] = useState(false);
  const [transactionVerificationLoading, setTransactionVerificationLoading] =
    useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const dropdownRef = useRef(null);
  const { userWallet } = useSelector((state) => state.wallet);
  const { companyInfo } = useSelector((state) => state.user);

  const { writeContractAsync, data: txHash, isLoading } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  // Get tokens based on chainId
  const tokens = getTokens(chainId);
  const faltToken = tokens.flatMap((group) => group.items);

  // Fetch live balances for each token at the top level
  const usdtBalance = useReadContract({
    abi,
    address: faltToken.find((token) => token.name === "USDT")?.address,
    functionName: "balanceOf",
    args: [address],
    enabled: !!address,
  });

  const usdcBalance = useReadContract({
    abi,
    address: faltToken.find((token) => token.name === "USDC")?.address,
    functionName: "balanceOf",
    args: [address],
    enabled: !!address,
  });

  // Map tokens with their live balances
  const tokenBalances = tokens.flatMap((group) =>
    group.items.map((token) => ({
      ...token,
      balance: token.name === "USDT" ? usdtBalance : usdcBalance,
    }))
  );

  // console.log("tokens", tokens);
  // console.log("faltToken", faltToken);
  // console.log("tokenBalances", tokenBalances);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmountInput(value);
    } else {
      toast.error("Invalid amount. Only numbers are allowed.");
      setAmountInput("");
    }
  };

  const handleFundTransfer = async () => {
    const token = tokenBalances.find((t) => t.name === selectedToken);
    if (!token || selectedToken === "token") {
      toast.error("Please select a valid token (e.g., USDT) to proceed.");
      return;
    }

    if (
      !amountInput ||
      isNaN(parseFloat(amountInput)) ||
      parseFloat(amountInput) <= 0
    ) {
      toast.error("Enter a valid amount.");
      return;
    }

    if (token.address === "Not Supported") {
      toast.error(`${token.name} is not supported on this network.`);
      return;
    }

    // Check if amount exceeds token balance
    const balanceData = token.balance.data;
    if (balanceData) {
      const balance = parseFloat(formatUnits(balanceData, token.decimals));
      const amount = parseFloat(amountInput);
      if (amount > balance) {
        toast.error(
          `Insufficient ${token.name} balance. Available: ${balance}`
        );
        return;
      }
    } else {
      toast.error("Unable to verify token balance. Please try again.");
      return;
    }

    if (
      !companyInfo.WALLET_ADDRESS ||
      companyInfo.WALLET_ADDRESS.length !== 42
    ) {
      toast.error("Invalid recipient wallet address.");
      return;
    }

    try {
      setIsMetaMaskOpen(true);
      const tx = await writeContractAsync({
        abi,
        address: token.address,
        functionName: "transfer",
        args: [
          companyInfo.WALLET_ADDRESS,
          parseUnits(amountInput, token.decimals),
        ],
      });
      console.log("Transaction Sent:", tx);
    } catch (error) {
      console.error("Transaction Failed:", error);
      toast.error("Transaction failed. Try again.");
    } finally {
      setIsMetaMaskOpen(false);
    }
  };

  useEffect(() => {
    const verifyTransaction = async () => {
      if (isConfirmed && txHash) {
        toast.success("Transaction confirmed!");
        setTransactionVerificationLoading(true);
        const loadingToastId = toast.loading("Verifying transaction...");

        try {
          const formData = {
            txHash,
            userAddress: address,
            amount: amountInput,
          };
          const result = await dispatch(
            verifyTransactionAsync(formData)
          ).unwrap();
          console.log("Verification Result:", result);

          toast.dismiss(loadingToastId);
          if (result.status === "success") {
            toast.success("Funds added successfully!");
          } else {
            toast.error("Transaction verification failed.");
          }
        } catch (error) {
          console.error("Verification Error:", error);
          toast.dismiss(loadingToastId);
          toast.error("Verification failed. Please try again.");
        } finally {
          setTransactionVerificationLoading(false);
        }
      }
    };

    verifyTransaction();
  }, [isConfirmed, txHash, address, amountInput, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <MasterLayout>
      <Breadcrumb title="Add Fund" />
      <div className="flex justify-center items-center mt-10">
        <div className="w-full max-w-lg !px-4 py-3 !bg-white dark:!bg-darkCard shadow-lg rounded-lg">
          <h6 className="heading">Add Fund</h6>
          <div className="grid grid-cols-2 gap-4 !mb-6">
            <div className="wallet-box wallet-fund">
              <p className="wallet-title">Fund Wallet</p>
              <span className="wallet-balance">
                ${getWalletBalance(userWallet, "fund_wallet")}
              </span>
            </div>
          </div>

          <div>
            {/* Amount Input */}
            <div className="">
              <label>Amount</label>
              <input
                type="text"
                placeholder="0.00"
                className="input-field"
                value={amountInput}
                onChange={handleAmountChange}
              />
            </div>

            {/* Token Dropdown */}
            <div className="flex flex-col relative mt-3" ref={dropdownRef}>
              <label className="flex justify-between mb-2">
                Token
                <span className="balance">
                  Balance:{" "}
                  {tokenBalances.find((t) => t.name === selectedToken)?.balance
                    .data
                    ? formatUnits(
                        tokenBalances.find((t) => t.name === selectedToken)
                          ?.balance.data,
                        tokenBalances.find((t) => t.name === selectedToken)
                          ?.decimals || 6
                      )
                    : "0.00"}
                </span>
              </label>

              <div
                className="input-field flex items-center cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FaDollarSign className="token-icon text-gray-500 mr-2" />
                <span>
                  {selectedToken === "token" ? "Select Token" : selectedToken}
                </span>
              </div>

              {isDropdownOpen && (
                <ul className="absolute bg-white dark:bg-darkCard w-full max-h-52 overflow-y-auto rounded shadow-md z-10 border border-gray-300 dark:border-darkBorder mt-1">
                  {tokens.map((group) => (
                    <div key={group.category}>
                      <li className="px-3 py-1 text-gray-600 dark:text-gray-200 text-sm font-semibold bg-gray-100 dark:bg-darkSecondary">
                        {group.category}
                      </li>
                      {group.items.map((token) => {
                        const balanceData = tokenBalances.find(
                          (t) => t.name === token.name
                        )?.balance;
                        return (
                          <li
                            key={token.name}
                            className="flex items-center cursor-pointer p-2 w-full hover:bg-gray-200 dark:bg-darkTertiary dark:hover:bg-gray-500"
                            onClick={() => {
                              setSelectedToken(token.name);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <img
                                  src={token.icon}
                                  alt={token.name}
                                  className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 object-cover mr-2"
                                />
                                <span className="text-gray-700 dark:text-gray-200">
                                  {token.name}
                                </span>
                              </div>
                              <span className="font-medium text-gray-500 dark:text-gray-400">
                                {balanceData?.data
                                  ? formatUnits(
                                      balanceData.data,
                                      token.decimals
                                    )
                                  : "0.00"}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </div>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Send Button */}
          <button
            className={`mt-3 ${amountInput ? "btn-primary" : "btn-disabled"}`}
            disabled={
              isLoading ||
              !amountInput ||
              isConfirming ||
              transactionVerificationLoading ||
              isMetaMaskOpen
            }
            onClick={handleFundTransfer}
          >
            {isMetaMaskOpen
              ? "Waiting for Confirmation..."
              : isLoading
              ? "Sending..."
              : isConfirming
              ? "Confirming..."
              : transactionVerificationLoading
              ? "Verifying..."
              : "Send"}
          </button>
        </div>
      </div>
    </MasterLayout>
  );
};

export default AddFund;
