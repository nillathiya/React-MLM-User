import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import { getWalletBalance } from "../../utils/walletUtils";
import { useForm } from "react-hook-form";
import { userFundTransferAsync } from "../../feature/transaction/transactionSlice";
import { checkUsernameAsync } from "../../feature/user/userSlice";
import {
  removeAmountFromWallet,
  getUserWalletAsync,
} from "../../feature/wallet/walletSlice";
import toast from "react-hot-toast";
import { FUND_TX_TYPE } from "../../utils/constant";
import { useNavigate } from "react-router-dom";

const TransferFund = () => {
  const navigate = useNavigate("");
  const dispatch = useDispatch();
  const [usernameValid, setUsernameValid] = useState(null);
  const [userActiveStatus, setUserActiveStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userWallet } = useSelector((state) => state.wallet);
  const { userSettings, companyInfo } = useSelector((state) => state.user);
  const { currentUser: loggedInUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(getUserWalletAsync());
      } catch (error) {
        console.log(error || "Server Error, Please try again");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const FUND_TRANSFER_WALLETS =
    userSettings.find(
      (setting) =>
        setting.title === "Fund" && setting.slug === "fund_transfer_wallets"
    )?.value || [];

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const username = watch("username");
  const walletType = watch("walletType");

  // Username validation effect
  useEffect(() => {
    if (!username) {
      setUsernameValid(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await dispatch(
          checkUsernameAsync({ username })
        ).unwrap();

        if (response.data.valid) {
          setUsernameValid(true);
          setUserActiveStatus(response.data.activeStatus);
          clearErrors("username");
        } else {
          setUsernameValid(false);
          setError("username", {
            type: "manual",
            message: "Username not found",
          });
        }
      } catch (error) {
        setUsernameValid(false);
        setError("username", {
          type: "manual",
          message: "Username not found",
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [username, dispatch, setError, clearErrors]);

  const handleFormSubmit = async (data) => {
    const minTransferLimit = Number(userSettings?.MIN_TRANSFER_LIMIT) || 0;
    const amount = parseFloat(data.amount);

    if (minTransferLimit && amount < minTransferLimit) {
      toast.error(`Min Fund Transfer limit is ${minTransferLimit}`);
      return;
    }

    try {
      const formData = {
        ...data,
        walletType: data.walletType || "fund_wallet",
        txType: FUND_TX_TYPE.FUND_TRANSFER,
      };

      await dispatch(userFundTransferAsync(formData)).unwrap();
      if (username.trim() !== loggedInUser.username.trim()) {
        await dispatch(
          removeAmountFromWallet({
            walletType: formData.walletType,
            amount: Number(amount),
          })
        );
      }

      toast.success("Fund Successfully Transferred");
      navigate("/fund/fund-transfer-history");
    } catch (error) {
      toast.error(
        error?.message || "Send Fund Failed, Please try again later."
      );
    }
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 gap-4 !mb-6">
        <div className="wallet-box bg-gray-200 dark:bg-gray-700 h-20 rounded-lg"></div>
        <div className="wallet-box bg-gray-200 dark:bg-gray-700 h-20 rounded-lg"></div>
      </div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <MasterLayout>
      <Breadcrumb title="Transfer Fund" />
      <div className="flex justify-center items-center mt-10">
        <div className="w-full max-w-lg !px-4 !py-3 bg-white dark:!bg-darkCard shadow-lg rounded-lg">
          <h6 className="heading">Fund Transfer</h6>
          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              {/* Wallet Balance Display */}
              <div className="grid grid-cols-2 gap-4 !mb-6">
                <div className="wallet-box wallet-main">
                  <p className="wallet-title">Main Wallet</p>
                  <span className="wallet-balance">
                    {companyInfo.CURRENCY}
                    {getWalletBalance(userWallet, "main_wallet")}
                  </span>
                </div>
                <div className="wallet-box wallet-fund">
                  <p className="wallet-title">Fund Wallet</p>
                  <span className="wallet-balance">
                    {companyInfo.CURRENCY}
                    {getWalletBalance(userWallet, "fund_wallet")}
                  </span>
                </div>
              </div>
              <form
                className="space-y-4"
                onSubmit={handleSubmit(handleFormSubmit)}
              >
                <div>
                  <label className="block mb-1">Username</label>
                  <input
                    type="text"
                    placeholder="Enter Username"
                    className="input-field w-full"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    })}
                  />
                  {errors.username && (
                    <p className="error-message text-red-500 mt-1">
                      {errors.username.message}
                    </p>
                  )}
                  {usernameValid === true && (
                    <p className="text-green-500 mt-1">✅ Username is valid</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1">Select Wallet</label>
                  <select
                    className="input-field w-full"
                    {...register("walletType", {
                      required: "Wallet Type is required",
                    })}
                  >
                    <option value="">Select Wallet</option>
                    {FUND_TRANSFER_WALLETS.map((wallet) => (
                      <option key={wallet.key} value={wallet.key}>
                        {wallet.label}
                      </option>
                    ))}
                  </select>
                  {errors.walletType && (
                    <p className="error-message text-red-500 mt-1">
                      {errors.walletType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1">Enter Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter Amount"
                    className="input-field w-full"
                    {...register("amount", {
                      required: "Amount is required",
                      min: {
                        value: 1,
                        message: "Amount must be at least $1",
                      },
                      validate: (value) => {
                        const balance =
                          getWalletBalance(userWallet, walletType) || 0;
                        return (
                          Number(value) <= balance || "Insufficient balance"
                        );
                      },
                    })}
                  />
                  {errors.amount && (
                    <p className="error-message text-red-500 mt-1">
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                <button
                  className="btn-primary mt-3 w-full"
                  type="submit"
                  disabled={isSubmitting || !usernameValid}
                >
                  {isSubmitting ? "Processing..." : "Transfer"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </MasterLayout>
  );
};

export default TransferFund;
