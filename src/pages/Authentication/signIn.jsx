import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import {
  writeContract,
  waitForTransactionReceipt,
  readContract,
} from "@wagmi/core";
import { config } from "../../config/wagmiConfig";
import ConnectWallet from "../../components/wallet/ConnectWallet";
import { useDispatch, useSelector } from "react-redux";
import {
  checkWalletAsync,
  userLoginAsync,
  selectUserExists,
  verifyTokenLoginAsync,
} from "../../feature/auth/authSlice";
import {
  registerNewUserAsync,
  checkSponsorAsync,
  getCompanyInfoAsync,
} from "../../feature/user/userSlice";
import { createUserWalletAsync } from "../../feature/wallet/walletSlice";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parseUnits } from "viem";
import { contractAbi } from "../../ABI/contractAbi";
import { abi as usdtAbi } from "../../ABI/usdtAbi";
import Confetti from "react-confetti";
import { MoveLeft } from "lucide-react";
const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const userExists = useSelector(selectUserExists);
  const { companyInfo } = useSelector((state) => state.user);

  // State
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sponsorId, setSponsorId] = useState(searchParams.get("ref") || "");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStage, setPaymentStage] = useState(null);
  const token = searchParams.get("impersonate");
  const [isSponsorValid, setIsSponsorValid] = useState(
    searchParams.get("ref") ? true : false
  );
  const [checkingSponsor, setCheckingSponsor] = useState(false);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [hasCheckedWallet, setHasCheckedWallet] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const TUSDT_ADDRESS = companyInfo?.TOKEN_CONTRACT;
  const FEES_CONTRACT_ADDRESS = companyInfo?.BSCADDRESS;
  const AMOUNT = parseUnits("1", 18);

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
        localStorage.setItem(
          `userToken_${result.data.user._id}`,
          result.data.token
        );
      }
      navigate("/dashboard");
    } catch (error) {
      toast.error(error || "Token validation failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getCompanyInfoAsync())
      .unwrap()
      .then((result) => {
        console.log("getCompanyInfoAsync Response:", result);
      })
      .catch((err) => {
        console.error("getCompanyInfoAsync Error:", err);
        toast.error(
          "Failed to fetch company info: " + (err.message || "Unknown error")
        );
      });
  }, [dispatch]);

  useEffect(() => {
    console.log("Company Info:", companyInfo);
  }, [companyInfo]);

  useEffect(() => {
    const checkWallet = async () => {
      if (isConnected && address && !hasCheckedWallet && !loading) {
        setLoading(true);

        try {
          const result = await dispatch(
            checkWalletAsync({ wallet: address })
          ).unwrap();

          console.log("result", result);
          if (result.status === "success");
          setHasCheckedWallet(true);
          // console.log("checkWalletAsync Response:", result);
          // console.log("checking userExisting condition...");
          // console.log("userExists", userExists);
        } catch (error) {
          console.error("checkWalletAsync Error:", error);
          toast.error("Failed to check wallet: " + (error || "Unknown error"));
        } finally {
          setLoading(false);
        }
      }
    };
    checkWallet();
  }, [isConnected, address, dispatch, hasCheckedWallet, userExists]);

  useEffect(() => {
    if (userExists) {
      handleLogin();
    }
  }, [userExists]);

  useEffect(() => {
    if (!searchParams.get("ref") && sponsorId) {
      setCheckingSponsor(true);
      dispatch(checkSponsorAsync(sponsorId))
        .unwrap()
        .then((result) => {
          console.log("checkSponsorAsync Response:", result);
          setIsSponsorValid(result.data.valid === true);
          if (!result.data.valid) {
            toast.error("Invalid Sponsor ID");
          }
        })
        .catch((error) => {
          console.error("checkSponsorAsync Error:", error);
          setIsSponsorValid(false);
          toast.error(
            "Error checking Sponsor ID: " + (error.message || "Unknown error")
          );
        })
        .finally(() => {
          setCheckingSponsor(false);
        });
    }
  }, [sponsorId, dispatch, searchParams]);

  const handleLogin = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const result = await dispatch(
        userLoginAsync({ wallet: address })
      ).unwrap();
      if (result.status === "success") {
        localStorage.setItem(
          `userToken_${result.data.user._id}`,
          result.data.token
        );
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
      setError(
        "Please fill all fields with a valid Sponsor ID and connect wallet"
      );
      toast.error(
        "Please fill all fields with a valid Sponsor ID and connect wallet"
      );
      return;
    }
    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions");
      toast.error("Please accept the Terms & Conditions");
      return;
    }
    if (chainId !== 97) {
      setError("Please switch to BSC Testnet");
      toast.error("Please switch to BSC Testnet");
      return;
    }
    if (!TUSDT_ADDRESS || !FEES_CONTRACT_ADDRESS) {
      setError("Contract addresses are not configured correctly");
      toast.error("Contract addresses are not configured correctly");
      console.error("Invalid contract addresses:", {
        TUSDT_ADDRESS,
        FEES_CONTRACT_ADDRESS,
      });
      return;
    }
    if (isRegistering) {
      toast.error("Registration already in progress");
      return;
    }

    setIsRegistering(true);
    setLoading(true);
    try {
      console.log("Checking balance for:", { TUSDT_ADDRESS, address });
      const usdtBalance = await readContract(config, {
        address: TUSDT_ADDRESS,
        abi: usdtAbi,
        functionName: "balanceOf",
        args: [address],
      });
      console.log("USDT Balance:", usdtBalance.toString());
      if (usdtBalance < AMOUNT) {
        setError("Insufficient USDT balance");
        toast.error("Insufficient USDT balance");
        return;
      }

      setPaymentStage("approving");
      const approveHash = await writeContract(config, {
        address: TUSDT_ADDRESS,
        abi: usdtAbi,
        functionName: "approve",
        args: [FEES_CONTRACT_ADDRESS, AMOUNT],
      });
      console.log("Approve Hash:", approveHash);
      await waitForTransactionReceipt(config, { hash: approveHash });
      toast.success("Allowance approved!");

      setPaymentStage("depositing");
      const depositHash = await writeContract(config, {
        address: FEES_CONTRACT_ADDRESS,
        abi: contractAbi,
        functionName: "deposit",
        args: [AMOUNT],
      });
      console.log("Deposit Hash:", depositHash);
      await waitForTransactionReceipt(config, { hash: depositHash });
      toast.success("Payment successful!");

      // Reset loading and paymentStage before proceeding
      setLoading(false);
      setPaymentStage(null);

      await handleRegister(depositHash);
    } catch (error) {
      let message = "Transaction failed";
      if (error?.message?.includes("User rejected")) {
        message = "Transaction rejected by user";
      } else if (error?.cause?.message?.includes("User rejected")) {
        message = "Transaction rejected by user";
      } else if (error?.shortMessage) {
        message = error.shortMessage;
      } else if (error.message.includes("invalid opcode")) {
        message =
          "Invalid contract or network configuration. Please check contract address and network.";
      }
      console.error("Payment Error:", error);
      setError(message);
      toast.error(message);
      disconnect();
    } finally {
      setLoading(false);
      setPaymentStage(null);
      setIsRegistering(false);
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

      if (registerResponse.status === "success") {
        console.log("Registration successful, showing welcome animation");
        // Ensure welcome animation is triggered
        setShowWelcome(true);
        await new Promise((resolve) => setTimeout(resolve, 30000));

        console.log("Welcome animation complete, proceeding to login");
        setShowWelcome(false);
        setRedirecting(true);

        const loginResponse = await dispatch(
          userLoginAsync({ wallet: address })
        ).unwrap();
        if (loginResponse.status === "success") {
          const userId = loginResponse.data.user._id;
          localStorage.setItem(`userToken_${userId}`, loginResponse.data.token);
          navigate("/dashboard");
        } else {
          throw new Error("Login failed after registration");
        }
      } else {
        throw new Error("Registration failed");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      toast.error(err.message || "Registration failed");
      disconnect();
    }
  };

  const isFormComplete =
    sponsorId &&
    name &&
    email &&
    phoneNumber &&
    isSponsorValid &&
    termsAccepted;

  // console.log("isConnected", isConnected);
  // console.log("address", address);
  // console.log("userExists", userExists);
  // console.log("hasCheckedWallet", hasCheckedWallet);
  // console.log("loading", loading);

  return (
    <section className="auth bg-base d-flex flex-wrap relative">
      <style>
        {`
          .confetti-fallback {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
          }
          .confetti-particle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: #f00;
            animation: fall 5s linear infinite;
          }
          @keyframes fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
          .welcome-container {
            z-index: 10000 !important;
          }
        `}
      </style>
      <div className="auth-left d-lg-block d-none">
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img src="assets/images/auth/auth-img.png" alt="" />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100 !space-y-5">
          <div className="w-24">
            <Link
              to={"/"}
              className="flex gap-2 !py-2 !px-3 bg-gradient-to-br from-yellow-600 to-slate-600 text-white rounded-lg"
            >
              <MoveLeft strokeWidth={1.25} />
              <span>Back</span>
            </Link>
          </div>
          <div>
            <Link to="/" className="mb-40 max-w-290-px">
              <img src="assets/images/logo.png" alt="" />
            </Link>
            <h4 className="mb-12">Sign Up with Wallet</h4>
            <p className="mb-32 text-secondary-light text-lg">
              Connect your wallet to create an account
            </p>
          </div>
          {error && <p className="text-danger mb-16">{error}</p>}
          {showWelcome ? (
            <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 welcome-container">
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                numberOfPieces={200}
                recycle={true}
                gravity={0.1}
                onConfettiComplete={() =>
                  console.log("Confetti animation completed")
                }
              />
              <div className="confetti-fallback">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="confetti-particle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                      animationDelay: `${Math.random() * 5}s`,
                    }}
                  />
                ))}
              </div>
              <div className="bg-[#F5F5DC] p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                <img
                  src="assets/images/logo.png"
                  alt="BitX Logo"
                  className="mx-auto mb-4 max-w-150-px"
                />
                <h2 className="text-2xl sm:text-3xl font-bold animate-pulse">
                  <span className="text-blue-600">
                    Thank you for Signing Up for BitX,{" "}
                  </span>
                  <span className="text-purple-600">{name || "User"}!</span>
                </h2>
                <p className="text-lg sm:text-xl text-green-600 mt-4 animate-bounce">
                  We welcome you to the DeFi world of BitX!
                </p>
                <p className="text-sm sm:text-base text-yellow-600 font-semibold mt-2 break-all">
                  Wallet: {address}
                </p>
              </div>
            </div>
          ) : redirecting ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <Loader loader="ClipLoader" color="blue" size={40} />
              <p className="text-lg text-blue-600 font-semibold animate-pulse">
                Redirecting to your BitX Dashboard...
              </p>
            </div>
          ) : loading || checkingSponsor ? (
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
                  className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12"
                >
                  Connect Wallet
                </button>
              ) : (
                // : userExists ? (
                //   <button
                //     onClick={handleLogin}
                //     className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12"
                //   >
                //     Login
                //   </button>
                // )

                !userExists && (
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="icon-field mb-16">
                      <span className="icon top-50 translate-middle-y">
                        <Icon icon="f7:person" />
                      </span>
                      <input
                        type="text"
                        value={sponsorId}
                        onChange={(e) =>
                          !searchParams.get("ref") &&
                          setSponsorId(e.target.value)
                        }
                        disabled={searchParams.get("ref") || isSponsorValid}
                        className="form-control h-56-px bg-neutral-50 radius-12"
                        placeholder="Sponsor ID (Referral)"
                      />
                    </div>
                    <div className="icon-field mb-16">
                      <span className="icon top-50 translate-middle-y">
                        <Icon icon="mage:email" />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control h-56-px bg-neutral-50 radius-12"
                        placeholder="Email"
                      />
                    </div>
                    <div className="icon-field mb-16">
                      <span className="icon top-50 translate-middle-y">
                        <Icon icon="mage:user" />
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control h-56-px bg-neutral-50 radius-12"
                        placeholder="Name"
                      />
                    </div>
                    <div className="icon-field mb-16">
                      <span className="icon top-50 translate-middle-y">
                        <Icon icon="mdi:phone" />
                      </span>
                      <PhoneInput
                        international
                        defaultCountry="US"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        className="form-control h-56-px bg-neutral-50 radius-12"
                      />
                    </div>
                    <div className="mb-20">
                      <div className="form-check style-check d-flex align-items-start">
                        <input
                          className="form-check-input border border-neutral-300 mt-4"
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          id="condition"
                        />
                        <label
                          className="form-check-label text-sm"
                          htmlFor="condition"
                        >
                          By creating an account, you agree to the
                          <Link to="#" className="text-primary-600 fw-semibold">
                            Terms & Conditions
                          </Link>{" "}
                          and our
                          <Link to="#" className="text-primary-600 fw-semibold">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </div>
                    <button
                      onClick={handlePaymentAndRegister}
                      disabled={!isFormComplete || isRegistering}
                      className={`btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32 ${
                        !isFormComplete || isRegistering
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Register (1 USDT)
                    </button>
                  </form>
                )
              )}
            </>
          )}
        </div>
      </div>
      {connectWalletModal && (
        <ConnectWallet setConnectWalletModal={setConnectWalletModal} />
      )}
    </section>
  );
};

export default SignUp;
