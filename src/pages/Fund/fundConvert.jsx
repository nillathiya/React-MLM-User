import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { userConvertFundsAsync } from "../../feature/transaction/transactionSlice";
import {
  removeAmountFromWallet,
  addAmountToWallet,
} from "../../feature/wallet/walletSlice";
import toast from "react-hot-toast";
import { getWalletBalance } from "../../utils/walletUtils";
import { safeParseJSON } from "../../utils/common";

const FundConvert = () => {
  const dispatch = useDispatch();
  const { userWallet } = useSelector((state) => state.wallet);
  const { userSettings, companyInfo } = useSelector((state) => state.user);

  const { FROM_WALLETS_TYPES, TO_WALLETS_TYPES } = React.useMemo(() => {
    const parsedFromWallets = safeParseJSON(userSettings?.CONVERT_FROM_WALLETS);
    const parsedToWallets = safeParseJSON(userSettings?.CONVERT_TO_WALLETS);

    return {
      FROM_WALLETS_TYPES: Array.isArray(parsedFromWallets)
        ? parsedFromWallets
        : parsedFromWallets
        ? [parsedFromWallets]
        : [],
      TO_WALLETS_TYPES: Array.isArray(parsedToWallets)
        ? parsedToWallets
        : parsedToWallets
        ? [parsedToWallets]
        : [],
    };
  }, [userSettings?.CONVERT_FROM_WALLETS, userSettings?.CONVERT_TO_WALLETS]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const fromWalletType = watch("fromWalletType");
  const amount = watch("amount");

  const handleFormSubmit = async (data) => {
    const formData = {
      ...data,
      amount: Number(data.amount), // Ensure amount is a number
      txType: "user_fund_convert",
    };

    try {
      // Prevent converting to the same wallet
      if (formData.fromWalletType === formData.walletType) {
        toast.error("Cannot convert to the same wallet");
        return;
      }

      const fromBalance =
        getWalletBalance(userWallet, formData.fromWalletType) || 0;
      if (Number(data.amount) > fromBalance) {
        toast.error("Insufficient balance in source wallet");
        return;
      }

      await dispatch(userConvertFundsAsync(formData)).unwrap();
      await dispatch(
        removeAmountFromWallet({
          walletType: formData.fromWalletType,
          amount: formData.amount,
        })
      );
      await dispatch(
        addAmountToWallet({
          walletType: formData.walletType,
          amount: formData.amount,
        })
      );
      toast.success("Funds Successfully Converted");
    } catch (error) {
      toast.error(
        error?.message || "Fund conversion failed. Please try again."
      );
    }
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Fund Convert" />
      <div className="flex justify-center items-center mt-10">
        <div className="w-full max-w-lg !px-4 !py-3 bg-white dark:!bg-darkCard shadow-lg rounded-lg">
          <h6 className="heading">Fund Convert</h6>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="wallet-box wallet-main">
              <p className="wallet-title">Main Wallet</p>
              <span className="wallet-balance">
                {companyInfo.CURRENCY}
                {getWalletBalance(userWallet, "main_wallet")?.toFixed(2) ||
                  "0.00"}
              </span>
            </div>
            <div className="wallet-box wallet-fund">
              <p className="wallet-title">Fund Wallet</p>
              <span className="wallet-balance">
                {companyInfo.CURRENCY}
                {getWalletBalance(userWallet, "fund_wallet")?.toFixed(2) ||
                  "0.00"}
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
            <div>
              <label className="block text-gray-700 dark:text-darkText font-medium mb-1">
                Select From Wallet
              </label>
              <select
                {...register("fromWalletType", {
                  required: "Please select a source wallet",
                })}
                className="w-full mt-1 p-3 border border-gray-300 dark:border-darkBorder rounded-lg 
                  bg-gray-50 dark:bg-darkCard text-gray-800 dark:text-darkText focus:ring-2 focus:ring-darkPrimary"
              >
                <option value="">Select Wallet</option>
                {FROM_WALLETS_TYPES.map((walletObj, index) =>
                  Object.entries(walletObj).map(([key, value]) => (
                    <option key={`${key}-${index}`} value={key}>
                      {value}
                    </option>
                  ))
                )}
              </select>
              {errors.fromWalletType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fromWalletType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 dark:text-darkText font-medium mb-1">
                Select To Wallet
              </label>
              <select
                {...register("walletType", {
                  required: "Please select a destination wallet",
                  validate: (value) =>
                    value !== fromWalletType || "Cannot select the same wallet",
                })}
                className="w-full mt-1 p-3 border border-gray-300 dark:border-darkBorder rounded-lg 
                  bg-gray-50 dark:bg-darkCard text-gray-800 dark:text-darkText focus:ring-2 focus:ring-darkPrimary"
              >
                <option value="">Select Wallet</option>
                {TO_WALLETS_TYPES.map((walletObj, index) =>
                  Object.entries(walletObj).map(([key, value]) => (
                    <option key={`${key}-${index}`} value={key}>
                      {value}
                    </option>
                  ))
                )}
              </select>
              {errors.walletType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.walletType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 dark:text-darkText font-medium mb-1">
                Enter Amount
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter Amount"
                {...register("amount", {
                  required: "Amount is required",
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than 0",
                  },
                  validate: (value) => {
                    const balance =
                      getWalletBalance(userWallet, fromWalletType) || 0;
                    return (
                      Number(value) <= balance || "Insufficient wallet balance"
                    );
                  },
                })}
                className="w-full mt-1 p-3 border border-gray-300 dark:border-darkBorder rounded-lg 
                  bg-gray-50 dark:bg-darkCard text-gray-800 dark:text-darkText focus:ring-2 focus:ring-darkPrimary"
              />
              {fromWalletType && amount && (
                <p className="text-sm text-gray-600 dark:text-darkText mt-1">
                  Available: {companyInfo.CURRENCY}
                  {getWalletBalance(userWallet, fromWalletType)?.toFixed(2) ||
                    "0.00"}
                </p>
              )}
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-darkPrimary text-white rounded-lg hover:bg-opacity-90 
                disabled:bg-gray-400 disabled:cursor-not-allowed text-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Convert"}
            </button>
          </form>
        </div>
      </div>
    </MasterLayout>
  );
};

export default FundConvert;
