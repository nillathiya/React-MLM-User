import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import ConnectWallet from "../../components/wallet/ConnectWallet";
import { useDispatch, useSelector } from "react-redux";
import {
  checkWalletAsync,
  userLoginAsync,
  selectUserExists,
  verifyTokenLoginAsync,
} from "../../feature/auth/authSlice";
import { registerNewUserAsync } from "../../feature/user/userSlice";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import { createUserWalletAsync } from "../../feature/wallet/walletSlice";
const SignIn = () => {
  const dispatch = useDispatch();
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refUsername = searchParams.get("ref");
  const token = searchParams.get("impersonate");
  const userExists = useSelector(selectUserExists);

  useEffect(() => {
    if (token) {
      verifyTokenLogin(token);
    }
  }, [token]);

  const verifyTokenLogin = async (token) => {
    setLoading(true);
    try {
      await dispatch(verifyTokenLoginAsync(token)).unwrap();
      console.log("dwehdkqwehdiqwe")
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

  // console.log("isConnected", isConnected);
  // console.log("address", address);

  const handleAuth = async () => {
    console.log("User not Connected to wallet");
    if (!address) return;
    console.log("User Connected to wallet");
    setLoading(true);
    setConnectWalletModal(false);
    try {
      if (userExists) {
        await dispatch(userLoginAsync({ wallet: address })).unwrap();
      } else {
        await dispatch(
          registerNewUserAsync({
            wallet: address,
            sponsorUsername: refUsername ? refUsername : null,
          })
        ).unwrap();
        const response = await dispatch(
          userLoginAsync({ wallet: address })
        ).unwrap();
        if (response.status == "success") {
          const userId = response.data.user._id;
          await dispatch(createUserWalletAsync(userId)).unwrap();
        }
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Authentication failed");
      disconnect();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen px-4">
      <div className="w-full max-w-md">
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-2 my-2 w-full">
                <Loader loader="ClipLoader" color="blue" size={40} />
                <span className="text-blue-600 font-semibold text-lg text-center animate-pulse">
                  Please Wait for Authentication...
                </span>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!isConnected || address === undefined) {
                    setConnectWalletModal(true);
                  } else if (userExists !== null) {
                    handleAuth();
                  }
                }}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition focus:outline-none text-center"
              >
                {userExists !== null && isConnected
                  ? "Authenticate"
                  : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </div>

      {connectWalletModal && (
        <ConnectWallet setConnectWalletModal={setConnectWalletModal} />
      )}
    </div>
  );
};

export default SignIn;
