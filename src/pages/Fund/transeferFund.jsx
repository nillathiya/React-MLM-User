import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import { getWalletBalance } from "../../utils/walletUtils";
import { useForm } from "react-hook-form";
import { userFundTransferAsync } from "../../feature/transaction/transactionSlice";
import { checkUsernameAsync } from "../../feature/user/userSlice";
import { removeAmountFromWallet } from "../../feature/wallet/walletSlice";
import toast from "react-hot-toast";
import { safeParseJSON } from "../../utils/common";

const TransferFund = () => {
  const dispatch = useDispatch();
  const [usernameValid, setUsernameValid] = useState(null);
  const [userActiveStatus, setUserActiveStatus] = useState(null);

  const { userWallet } = useSelector((state) => state.wallet);
  const { userSettings, companyInfo } = useSelector((state) => state.user);

  // Handle wallet types parsing
  const TRANSFER_WALLETS_TYPE = React.useMemo(() => {
    const parsedWallets = safeParseJSON(userSettings?.TRANSFER_WALLETS);
    if (Array.isArray(parsedWallets)) {
      return parsedWallets;
    }
    return parsedWallets ? [parsedWallets] : [];
  }, [userSettings?.TRANSFER_WALLETS]);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const username = watch("username");

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
        txType: "user_fund_transfer",
      };

      await dispatch(userFundTransferAsync(formData)).unwrap();
      await dispatch(
        removeAmountFromWallet({
          walletType: formData.walletType,
          amount: Number(amount),
        })
      );

      toast.success("Fund Successfully Transferred");
    } catch (error) {
      toast.error(
        error?.message || "Send Fund Failed, Please try again later."
      );
    }
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Transfer Fund" />
      <div className="flex justify-center items-center mt-10">
        <div className="w-full max-w-lg !px-4 !py-3 bg-white dark:bg-darkCard shadow-lg rounded-lg">
          <h6 className="heading">Fund Transfer</h6>
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
          <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
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
                {TRANSFER_WALLETS_TYPE.map((walletObj, index) =>
                  Object.entries(walletObj).map(([key, value]) => (
                    <option key={`${key}-${index}`} value={key}>
                      {value}
                    </option>
                  ))
                )}
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
                      getWalletBalance(userWallet, "fund_wallet") || 0;
                    return Number(value) <= balance || "Insufficient balance";
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
        </div>
      </div>
    </MasterLayout>
  );
};

export default TransferFund;
