import React, { useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { userConvertFundsAsync } from "../../feature/transaction/transactionSlice";
import {
  removeAmountFromWallet,
  addAmountToWallet,
  getUserWalletAsync,
} from "../../feature/wallet/walletSlice";
import toast from "react-hot-toast";
import { getWalletBalance } from "../../utils/walletUtils";
import { FUND_TX_TYPE } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import { getNameBySlugFromWalletSetting } from "../../utils/common";
import Loader from "../../components/common/Loader";

const FundConvert = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    userWallet,
    loading: walletLoading,
    walletSettings,
  } = useSelector((state) => state.wallet);
  const { userSettings = [], companyInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getUserWalletAsync()).unwrap();
        // Optionally fetch userSettings if not already loaded
        // await dispatch(fetchUserSettingsAsync()).unwrap();
      } catch (error) {
        toast.error(error.message || "Failed to load data");
      }
    };
    fetchData();
  }, [dispatch]);

  // Ensure array type for wallet settings
  const FUND_CONVERT_FROM_WALLETS = Array.isArray(
    userSettings.find(
      (setting) =>
        setting.title === "Fund" && setting.slug === "fund_convert_from_wallets"
    )?.value
  )
    ? userSettings.find(
        (setting) =>
          setting.title === "Fund" && setting.slug === "fund_convert_from_wallets"
      )?.value
    : [];
  const FUND_CONVERT_TO_WALLETS = Array.isArray(
    userSettings.find(
      (setting) =>
        setting.title === "Fund" && setting.slug === "fund_convert_to_wallets"
    )?.value
  )
    ? userSettings.find(
        (setting) =>
          setting.title === "Fund" && setting.slug === "fund_convert_to_wallets"
      )?.value
    : [];

  const walletFromOptions = FUND_CONVERT_FROM_WALLETS.map((wallet) => ({
    key: wallet,
    label: getNameBySlugFromWalletSetting(walletSettings, wallet) || wallet,
  }));
  const walletToOptions = FUND_CONVERT_TO_WALLETS.map((wallet) => ({
    key: wallet,
    label: getNameBySlugFromWalletSetting(walletSettings, wallet) || wallet,
  }));

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
      amount: Number(data.amount),
      txType: FUND_TX_TYPE.FUND_CONVERT,
    };

    try {
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
      navigate("/fund/fund-convert-history");
    } catch (error) {
      toast.error(
        error?.message || "Fund conversion failed. Please try again."
      );
    }
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="animate-pulse w-full max-w-lg px-4 py-3 bg-white dark:bg-darkCard shadow-lg rounded-lg">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
      <Breadcrumb title="Fund Convert" />
      <div className="flex justify-center items-center mt-10">
        <div className="w-full max-w-lg !px-4 !py-3 bg-white dark:!bg-darkCard shadow-lg rounded-lg">
          <h6 className="heading">Fund Convert Form</h6>

          {walletLoading ? (
            <SkeletonLoader />
          ) : (
            <>
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

              <form
                className="space-y-6"
                onSubmit={handleSubmit(handleFormSubmit)}
              >
                <div>
                  <label className="block text-gray-700 dark:text-darkText font-medium mb-1">
                    Select From Wallet
                  </label>
                  <select
                    {...register("fromWalletType", {
                      required: "Please select a source wallet",
                    })}
                    className="w-full mt-1 p-3 border border-gray-300 dark:border-darkBorder rounded-lg bg-gray-50 dark:bg-darkCard text-gray-800 dark:text-darkText focus:ring-2 focus:ring-darkPrimary"
                  >
                    <option value="">Select Wallet</option>
                    {walletFromOptions.map((wallet) => (
                      <option key={wallet.key} value={wallet.key}>
                        {wallet.label}
                      </option>
                    ))}
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
                        value !== fromWalletType ||
                        "Cannot select the same wallet",
                    })}
                    className="w-full mt-1 p-3 border border-gray-300 dark:border-darkBorder rounded-lg bg-gray-50 dark:bg-darkCard text-gray-800 dark:text-darkText focus:ring-2 focus:ring-darkPrimary"
                  >
                    <option value="">Select Wallet</option>
                    {walletToOptions.map((wallet) => (
                      <option key={wallet.key} value={wallet.key}>
                        {wallet.label}
                      </option>
                    ))}
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
                          Number(value) <= balance ||
                          "Insufficient wallet balance"
                        );
                      },
                    })}
                    className="w-full mt-1 p-3 border border-gray-300 dark:border-darkBorder rounded-lg bg-gray-50 dark:bg-darkCard text-gray-800 dark:text-darkText focus:ring-2 focus:ring-darkPrimary"
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
                  className="w-full p-3 bg-darkPrimary text-white rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed text-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Convert"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </MasterLayout>
  );
};

export default FundConvert;