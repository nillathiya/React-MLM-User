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

const FundConvert = () => {
  const dispatch = useDispatch();
  const { userWallet } = useSelector((state) => state.wallet);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const handleFormSubmit = async (data) => {
    const formData = {
      ...data,
      txType: "user_fund_convert",
    };
    try {
      await dispatch(userConvertFundsAsync(formData)).unwrap();
      await dispatch(
        removeAmountFromWallet({
          walletType: data.fromWalletType,
          amount: data.amount,
        })
      );
      await dispatch(
        addAmountToWallet({ walletType: data.walletType, amount: data.amount })
      );
      toast.success("Fund Successfully Transferred");
    } catch (error) {
      toast.error(error || "Send Fund Failed, Please try again later.");
    }
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Fund Convert" />

      <div className="flex justify-center items-center mt-10">
        <div className="w-full max-w-lg !px-4 py-3 !bg-white dark:!bg-darkCard shadow-lg rounded-lg">
          {/* Page Heading */}
          <h6 className="heading">Fund Convert</h6>

          {/* Wallet Balance Display */}
          <div className="grid grid-cols-2 gap-4 !mb-6">
            <div className="wallet-box wallet-main">
              <p className="wallet-title">Main Wallet</p>
              <span className="wallet-balance">
                ${getWalletBalance(userWallet, "main_wallet")}
              </span>
            </div>

            <div className="wallet-box wallet-fund">
              <p className="wallet-title">Fund Wallet</p>
              <span className="wallet-balance">
                ${getWalletBalance(userWallet, "fund_wallet")}
              </span>
            </div>
          </div>

          {/* Fund Transfer Form */}
          <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
            {/* From Wallet Selection */}
            <div>
              <label className="block text-gray-700  dark:text-darkText font-medium">
                Select From Wallet
              </label>
              <select
                {...register("fromWalletType", {
                  required: "Please select a wallet",
                })}
                className="w-full mt-1 p-3 border border-gray-300 dark:border-darkBorder rounded-lg 
      bg-gray-50 dark:bg-darkCard text-gray-800 dark:text-darkText focus:ring-2 focus:ring-darkPrimary"
              >
                <option value="">Select Wallet</option>
                <option value="fund_wallet">Fund Wallet</option>
                <option value="main_wallet">Main Wallet</option>
              </select>
              {errors.fromWalletType && (
                <p className="error-message">{errors.fromWalletType.message}</p>
              )}
            </div>

            {/* To Wallet Selection */}
            <div>
              <label className="block text-gray-700 dark:text-darkText font-medium">
                Select To Wallet
              </label>
              <select
                {...register("walletType", {
                  required: "Please select a wallet",
                })}
                className="w-full mt-1 p-3 border border-gray-300 dark:border-darkBorder rounded-lg 
      bg-gray-50 dark:bg-darkCard text-gray-800 dark:text-darkText focus:ring-2 focus:ring-darkPrimary"
              >
                <option value="">Select Wallet</option>
                <option value="fund_wallet">Fund Wallet</option>
                <option value="main_wallet">Main Wallet</option>
              </select>
              {errors.walletType && (
                <p className="error-message">{errors.walletType.message}</p>
              )}
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-gray-700 dark:text-darkText font-medium">
                Enter Amount
              </label>
              <input
                type="number"
                placeholder="Enter Amount"
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 1, message: "Amount must be greater than 0" },
                })}
                className="w-full mt-1 p-3 border border-gray-300 dark:border-darkBorder rounded-lg 
                bg-gray-50 dark:bg-darkCard text-gray-800 dark:text-darkText focus:ring-2 focus:ring-darkPrimary"
              />

              {errors.amount && (
                <p className="error-message">{errors.amount.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
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
