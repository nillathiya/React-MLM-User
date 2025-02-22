import React, { useState, useEffect, useRef } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
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
import { COMPANY } from "../../constants/company";
import { useDispatch } from "react-redux";
import { verifyTransactionAsync } from "../../feature/transaction/transactionSlice";

// Token Data
const tokens = [
  {
    category: "Stablecoins",
    items: [
      {
        name: "USDT",
        icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=026",
        balance: "10.00",
      },
      {
        name: "USDC",
        icon: "https://images.vexels.com/media/users/3/135829/isolated/svg/1a857d341d8b6dd31426d6a62a8d9054.svg",
        balance: "5.00",
      },
    ],
  },
];

const AddFund = () => {
  const dispatch = useDispatch();
  const [selectedToken, setSelectedToken] = useState("token");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const [isMetaMaskOpen, setIsMetaMaskOpen] = useState(false);
  const [transactionVerificationLoading, setTransactionVerificationLoading] =
    useState(false);
  const { address } = useAccount();
  const dropdownRef = useRef(null);

  const { writeContractAsync, data: txHash, isLoading } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  // Handle Amount Input
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmountInput(value);
    } else {
      toast.error("Invalid amount. Only numbers are allowed.");
      setAmountInput("");
    }
  };

  // Handle Fund Transfer
  const handleFundTransfer = async () => {
    if (selectedToken !== "USDT") {
      toast.error("Please select USDT to proceed.");
      return;
    }

    if (!amountInput || isNaN(amountInput) || parseFloat(amountInput) <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }

    try {
      setIsMetaMaskOpen(true); // MetaMask is opening
      const tx = await writeContractAsync({
        abi,
        address: COMPANY.USDT_ADDRESS,
        functionName: "transfer",
        args: [COMPANY.WALLET_ADDRESS, parseUnits(amountInput, 18)],
      });

      console.log("Transaction Sent:", tx);
    } catch (error) {
      console.error("Transaction Failed:", error);
      toast.error("Transaction failed. Try again.");
    } finally {
      setIsMetaMaskOpen(false);
    }
  };

  // Handle Transaction Status & Verification
  useEffect(() => {
    const verifyTransaction = async () => {
      if (isConfirmed) {
        toast.success("Transaction confirmed!");

        setTransactionVerificationLoading(true);
        // Show loading toast and store its ID
        const loadingToastId = toast.loading("Please wait for verification...");

        try {
          const formData = {
            txHash: txHash,
            userAddress: address,
            amount: amountInput,
          };

          const result = await dispatch(
            verifyTransactionAsync(formData)
          ).unwrap();
          console.log("Verification Result:", result);

          // Remove the loading toast
          toast.dismiss(loadingToastId);

          if (result.status == "success") {
            toast.success("USDT added successfully!");
          } else {
            toast.error("Transaction verification failed.");
          }
        } catch (error) {
          console.error("Verification Error:", error);
          toast.dismiss(loadingToastId);
          toast.error("Verification failed. Please try again.");
        } finally {
          toast.dismiss(loadingToastId);
          setTransactionVerificationLoading(false);
        }
      }
    };

    verifyTransaction();
  }, [isConfirmed, txHash, address, amountInput, dispatch]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <MasterLayout>
      <Breadcrumb title="Add Fund" />
      <div className="flex justify-center items-center mt-10">
        <div className="w-full max-w-lg !px-4 py-3 !bg-white dark:!bg-darkCard shadow-lg rounded-lg">
          {/* Page Heading */}
          <h6 className="heading">Add Fund</h6>
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
                Token{" "}
                <span className="balance">
                  Balance:{" "}
                  {tokens
                    .flatMap((g) => g.items)
                    .find((t) => t.name === selectedToken)?.balance || "0.00"}
                </span>
              </label>

              <div
                className=""
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="input-field flex items-center">
                  <FaDollarSign className="token-icon text-gray-500 mr-2" />
                  <span>
                    {selectedToken === "token" ? "Select Token" : selectedToken}
                  </span>
                </div>
              </div>

              {/* Dropdown List */}
              {isDropdownOpen && (
                <ul className="absolute bg-white dark:bg-darkCard w-full max-h-52 overflow-y-auto rounded shadow-md z-10 border border-gray-300 dark:border-darkBorder mt-1">
                  {tokens.map((group) => (
                    <div key={group.category}>
                      {/* Category Header */}
                      <li className="px-3 py-1 text-gray-600 dark:text-gray-200 text-sm font-semibold bg-gray-100 dark:bg-darkSecondary">
                        {group.category}
                      </li>

                      {/* Dropdown Items */}
                      {group.items.map((token) => (
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
                              {token.balance}
                            </span>
                          </div>
                        </li>
                      ))}
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
              ? "Verification..."
              : "Send USDT"}
          </button>
        </div>
      </div>
    </MasterLayout>
  );
};

export default AddFund;
