import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import { writeContract, waitForTransactionReceipt, readContract } from "@wagmi/core";
import { config } from "../../config/wagmiConfig";
import ConnectWallet from "../../components/wallet/ConnectWallet";
import { useDispatch, useSelector } from "react-redux";
import {
  checkWalletAsync,
  userLoginAsync,
  selectUserExists,
  verifyTokenLoginAsync,
} from "../../feature/auth/authSlice";
import { registerNewUserAsync, checkSponsorAsync } from "../../feature/user/userSlice";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import { createUserWalletAsync } from "../../feature/wallet/walletSlice";
import { contractAbi } from "../../ABI/contractAbi";
import { abi as usdtAbi } from "../../ABI/usdtAbi";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parseUnits } from "viem";


const SignIn = () => {
  const dispatch = useDispatch();
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refUsername = searchParams.get("ref");
  const token = searchParams.get("impersonate");
  const userExists = useSelector(selectUserExists);
  const { companyInfo } = useSelector((state) => state.user);
  // Form state
  const [sponsorId, setSponsorId] = useState(refUsername || "");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStage, setPaymentStage] = useState(null); // null, "approving", "depositing"
  const [isSponsorValid, setIsSponsorValid] = useState(refUsername ? true : false); // Prefilled ref is assumed valid
  const [checkingSponsor, setCheckingSponsor] = useState(false);

  const TUSDT_ADDRESS = companyInfo.TOKEN_CONTRACT; // BSC Testnet tUSDT
  const FEES_CONTRACT_ADDRESS = companyInfo.BSCADDRESS;
  const AMOUNT = parseUnits("1", 18); // 1 tUSDT

  useEffect(() => {
    if (token) {
      verifyTokenLogin(token);
    }
  }, [token]);

  const verifyTokenLogin = async (token) => {
    setLoading(true);
    try {
      const result = await dispatch(verifyTokenLoginAsync(token)).unwrap();
      if (result.status === "success" || result.statusCode === 200) {
        localStorage.setItem(`userToken_${result.data.user._id}`, result.data.token);
      }
      navigate("/dashboard");
    } catch (error) {
      toast.error(error || "Token validation failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address && !loading) {
      dispatch(checkWalletAsync({ wallet: address }));
    }
  }, [isConnected, address, dispatch, loading]);

  // Check sponsor validity when sponsorId changes (only if not prefilled)
  useEffect(() => {
    if (!refUsername && sponsorId) {
      const validateSponsor = async () => {
        setCheckingSponsor(true);
        try {
          const sponsor = sponsorId;
          const result = await dispatch(checkSponsorAsync(sponsor)).unwrap();
          setIsSponsorValid(result.data.valid === true);
          if (!result.data.valid) {
            toast.error("Invalid Sponsor ID");
          }
        } catch (error) {
          setIsSponsorValid(false);
          toast.error("Error checking Sponsor ID");
        } finally {
          setCheckingSponsor(false);
        }
      };
      validateSponsor();
    }
  }, [sponsorId, dispatch, refUsername]);

  const handleLogin = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const result = await dispatch(userLoginAsync({ wallet: address })).unwrap();
      if (result.status === "success") {
        localStorage.setItem(`userToken_${result.data.user._id}`, result.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.message || "Login failed");
      disconnect();
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentAndRegister = async () => {
    if (!address || !sponsorId || !email || !phoneNumber || !isSponsorValid) {
      toast.error("Please fill all fields with a valid Sponsor ID and connect wallet");
      return;
    }
    if (chainId !== 97) {
      toast.error("Please switch to BSC Testnet");
      return;
    }

    setLoading(true);
    try {
      // Step 0 : check USDT Balancce
      const usdtbalance = await readContract(config, {
        address: TUSDT_ADDRESS,
        abi: usdtAbi,
        functionName: "balanceOf",
        args: [address],
      });
      if (usdtbalance < AMOUNT) {
        toast.error("Insufficient USDT balance.");
        return;
      }
      // Step 1: Approve tUSDT
      setPaymentStage("approving");
      const approveHash = await writeContract(config, {
        address: TUSDT_ADDRESS,
        abi: usdtAbi,
        functionName: "approve",
        args: [FEES_CONTRACT_ADDRESS, AMOUNT],
      });
      await waitForTransactionReceipt(config, { hash: approveHash });
      toast.success("Allowance approved!");

      // Step 2: Deposit to fees contract
      setPaymentStage("depositing");
      const depositHash = await writeContract(config, {
        address: FEES_CONTRACT_ADDRESS,
        abi: contractAbi,
        functionName: "deposit",
        args: [AMOUNT],
      });
      await waitForTransactionReceipt(config, { hash: depositHash });
      toast.success("Payment successful!");

      // Step 3: Register user
      await handleRegister(depositHash);
    } catch (error) {
      let message = "Transaction failed";

      if (error?.message?.includes("User rejected")) {
        message = "Transaction rejected by user";
      } else if (error?.cause?.message?.includes("User rejected")) {
        message = "Transaction rejected by user";
      } else if (error?.shortMessage) {
        message = error.shortMessage;
      }

      toast.error(message);
      disconnect();
    } finally {
      setLoading(false);
      setPaymentStage(null);
    }
  };

  const handleRegister = async (depositHash) => {
    try {
      const registerResponse = await dispatch(
        registerNewUserAsync({
          wallet: address,
          sponsorUsername: sponsorId,
          email,
          phoneNumber,
          hash: depositHash,
        })
      ).unwrap();

      const loginResponse = await dispatch(userLoginAsync({ wallet: address })).unwrap();
      if (loginResponse.status === "success") {
        const userId = loginResponse.data.user._id;
        localStorage.setItem(`userToken_${userId}`, loginResponse.data.token);
        await dispatch(createUserWalletAsync(userId)).unwrap();
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.message || "Registration failed");
      disconnect();
    }
  };

  const isFormComplete = sponsorId && email && phoneNumber && isSponsorValid;

  return (
    <div className="flex justify-center items-center h-screen px-4">
      <div className="w-full max-w-md">
        <div className="p-6 bg-white shadow-lg rounded-lg">
          {loading || checkingSponsor ? (
            <div className="flex flex-col items-center justify-center gap-2 my-2 w-full">
              <Loader loader="ClipLoader" color="blue" size={40} />
              <span className="text-blue-600 font-semibold text-lg text-center animate-pulse">
                {checkingSponsor
                  ? "Checking Sponsor ID..."
                  : paymentStage === "approving"
                    ? "Approving tUSDT..."
                    : paymentStage === "depositing"
                      ? "Processing Payment..."
                      : "Please Wait for Authentication..."}
              </span>
            </div>
          ) : (
            <>
              {!isConnected || !address ? (
                <button
                  onClick={() => setConnectWalletModal(true)}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition focus:outline-none text-center"
                >
                  Connect Wallet
                </button>
              ) : userExists ? (
                <button
                  onClick={handleLogin}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition focus:outline-none text-center"
                >
                  Login
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sponsor ID (Referral)
                    </label>
                    <input
                      type="text"
                      value={sponsorId}
                      onChange={(e) => !refUsername && setSponsorId(e.target.value)}
                      disabled={refUsername || isSponsorValid} // Disabled if prefilled or valid
                      className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="Enter Sponsor ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <PhoneInput
                      international
                      defaultCountry="US"
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handlePaymentAndRegister}
                    disabled={!isFormComplete}
                    className={`w-full px-6 py-3 text-white font-medium rounded-lg shadow-md transition focus:outline-none text-center ${isFormComplete
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Register (1 USDT)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {connectWalletModal && (
        <ConnectWallet setConnectWalletModal={setConnectWalletModal} />
      )}
    </div>
  );
};

export default SignIn;