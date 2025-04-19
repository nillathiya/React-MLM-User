import React, { useState, useEffect, useRef } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { contractAbi } from "../../ABI/contractAbi";
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
import {
  getUserWalletAsync,
  addAmountToWallet,
} from "../../feature/wallet/walletSlice";
import { getNameBySlugFromWalletSetting } from "../../utils/common";

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
  const { userWallet, walletSettings } = useSelector((state) => state.wallet);
  const { companyInfo, userSettings } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [approvalTxHash, setApprovalTxHash] = useState(null);
  const [depositTxHash, setDepositTxHash] = useState(null);
  const [hasDeposited, setHasDeposited] = useState(false); // New flag to prevent multiple deposits

  const { writeContractAsync, isLoading: isWriting } = useWriteContract();

  // Track approval transaction receipt
  const {
    isLoading: isApprovalConfirming,
    isSuccess: isApprovalConfirmed,
    error: approvalError,
  } = useWaitForTransactionReceipt({
    hash: approvalTxHash,
  });

  // Track deposit transaction receipt
  const {
    isLoading: isDepositConfirming,
    isSuccess: isDepositConfirmed,
    error: depositError,
  } = useWaitForTransactionReceipt({
    hash: depositTxHash,
  });

  const addFundWalletType = userSettings.find(
    (setting) =>
      setting.title === "Investment" && setting.slug === "add_fund_wallet"
  )?.value;
  const addFundWalletName = getNameBySlugFromWalletSetting(
    walletSettings,
    addFundWalletType
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        dispatch(getUserWalletAsync());
      } catch (error) {
        console.log(error || "Server Error, Please try again");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  // Get tokens based on chainId
  const tokens = getTokens(chainId);
  const faltToken = tokens.flatMap((group) => group.items);

  // Fetch live balances for each token at the top level
  const usdtBalance = useReadContract({
    abi,
    address: companyInfo.TOKEN_CONTRACT,
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

    if (!companyInfo.BSCADDRESS || companyInfo.BSCADDRESS.length !== 42) {
      toast.error("Invalid recipient wallet address.");
      return;
    }

    const amount = parseUnits(amountInput, token.decimals);

    try {
      setIsMetaMaskOpen(true);
      setHasDeposited(false); // Reset deposit flag

      // 1️⃣ Step 1: Approve token allowance
      const approvalToastId = toast.loading("Approving token allowance...");
      try {
        console.log("Initiating approval transaction...");
        const approvalTx = await writeContractAsync({
          abi: abi,
          address: token.address,
          functionName: "approve",
          args: [companyInfo.BSCADDRESS, amount],
        });
        console.log("Approval transaction hash:", approvalTx);
        toast.dismiss(approvalToastId);
        toast.success("Approval transaction sent! Waiting for confirmation...");
        setApprovalTxHash(approvalTx);
      } catch (error) {
        console.error("Approval Error:", error);
        toast.dismiss(approvalToastId);
        toast.error(`Approval failed: ${error.message || "Unknown error"}`);
        throw error;
      }
    } catch (error) {
      console.error("Transaction Flow Failed:", error);
      setIsMetaMaskOpen(false);
    }
  };

  // Handle approval confirmation and initiate deposit (once)
  useEffect(() => {
    if (isApprovalConfirmed && approvalTxHash && !hasDeposited) {
      console.log("Approval transaction confirmed!");
      toast.success("Token allowance approved!");

      // Proceed to deposit transaction
      const token = tokenBalances.find((t) => t.name === selectedToken);
      const amount = parseUnits(amountInput, token.decimals);

      const initiateDeposit = async () => {
        const depositToastId = toast.loading("Initiating deposit...");
        try {
          console.log("Initiating deposit transaction...");
          const depositTx = await writeContractAsync({
            abi: contractAbi,
            address: companyInfo.BSCADDRESS,
            functionName: "deposit",
            args: [amount],
          });
          console.log("Deposit transaction hash:", depositTx);
          toast.dismiss(depositToastId);
          toast.success("Deposit transaction sent!");
          setDepositTxHash(depositTx);
          setHasDeposited(true); // Mark deposit as initiated
        } catch (error) {
          console.error("Deposit Error:", error);
          toast.dismiss(depositToastId);
          toast.error(`Deposit failed: ${error.message || "Unknown error"}`);
        } finally {
          setIsMetaMaskOpen(false);
        }
      };

      initiateDeposit();
    } else if (approvalError && approvalTxHash) {
      console.error("Approval Confirmation Error:", approvalError);
      toast.error(
        `Approval confirmation failed: ${approvalError.message || "Unknown error"}`
      );
      setIsMetaMaskOpen(false);
      setHasDeposited(false);
    }
  }, [isApprovalConfirmed, approvalError, approvalTxHash, hasDeposited]);

  // Handle deposit confirmation and verification
  useEffect(() => {
    const verifyTransaction = async () => {
      if (isDepositConfirmed && depositTxHash) {
        console.log("Deposit transaction confirmed!");
        const confirmToastId = toast.loading(
          "Confirming deposit on blockchain..."
        );
        try {
          toast.dismiss(confirmToastId);
          toast.success("Deposit transaction confirmed!");
          setTransactionVerificationLoading(true);
          const verifyToastId = toast.loading("Verifying transaction...");

          const formData = {
            txHash: depositTxHash,
            userAddress: address,
            amount: amountInput,
          };
          const result = await dispatch(
            verifyTransactionAsync(formData)
          ).unwrap();
          console.log("Verification Result:", result);

          toast.dismiss(verifyToastId);
          if (result.status === "success" || result.statusCode === 200) {
            await dispatch(
              addAmountToWallet({
                walletType: addFundWalletType,
                amount: amountInput,
              })
            );
            toast.success("Funds added successfully!");
          } else {
            toast.error("Transaction verification failed.");
          }
        } catch (error) {
          console.error("Verification Error:", error);
          toast.dismiss(confirmToastId);
          toast.error("Verification failed. Please try again.");
        } finally {
          setTransactionVerificationLoading(false);
        }
      } else if (depositError && depositTxHash) {
        console.error("Deposit Confirmation Error:", depositError);
        toast.error(
          `Deposit confirmation failed: ${depositError.message || "Unknown error"}`
        );
        setTransactionVerificationLoading(false);
      }
    };

    verifyTransaction();
  }, [
    isDepositConfirmed,
    depositError,
    depositTxHash,
    dispatch,
    address,
    amountInput,
    addFundWalletType,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 gap-4 !mb-6">
        <div className="wallet-box bg-gray-200 dark:bg-gray-700 h-20 rounded-lg"></div>
      </div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <MasterLayout>
      <Breadcrumb title="Add Fund" />
      <div className="flex justify-center items-center mt-10">
        <div className="w-full max-w-lg !px-4 py-3 !bg-white dark:!bg-darkCard shadow-lg rounded-lg">
          <h6 className="heading">Add Fund</h6>
          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 !mb-6">
                <div className="wallet-box wallet-fund">
                  <p className="wallet-title">
                    {addFundWalletName || "Add Fund Wallet"}
                  </p>
                  <span className="wallet-balance flex flex-wrap items-center justify-center">
                    <span className="currency mr-1">
                      {companyInfo.CURRENCY}
                    </span>
                    <span className="amount">
                      {getWalletBalance(userWallet, addFundWalletType)}
                    </span>
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
                      {tokenBalances.find((t) => t.name === selectedToken)
                        ?.balance.data
                        ? formatUnits(
                            tokenBalances.find((t) => t.name === selectedToken)
                              ?.balance.data,
                            tokenBalances.find((t) => t.name === selectedToken)
                              ?.decimals || 18
                          )
                        : "0.00"}
                    </span>
                  </label>

                  <div
                    className="input-field flex items-center cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="token-icon text-gray-500 mr-2">
                      {companyInfo.CURRENCY}
                    </span>
                    <span>
                      {selectedToken === "token"
                        ? "Select Token"
                        : selectedToken}
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
                className={`mt-3 ${
                  amountInput ? "btn-primary" : "btn-disabled"
                }`}
                disabled={
                  isWriting ||
                  !amountInput ||
                  isApprovalConfirming ||
                  isDepositConfirming ||
                  transactionVerificationLoading ||
                  isMetaMaskOpen
                }
                onClick={handleFundTransfer}
              >
                {isMetaMaskOpen
                  ? "Waiting for MetaMask..."
                  : isWriting
                  ? "Processing..."
                  : isApprovalConfirming
                  ? "Confirming Approval..."
                  : isDepositConfirming
                  ? "Confirming Deposit..."
                  : transactionVerificationLoading
                  ? "Verifying Transaction..."
                  : "Send"}
              </button>
            </>
          )}
        </div>
      </div>
    </MasterLayout>
  );
};

export default AddFund;