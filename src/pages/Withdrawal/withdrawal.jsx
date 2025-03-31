import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import MasterLayout from "../../masterLayout/MasterLayout";
import { getWalletBalance } from "../../utils/walletUtils";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { userFundWithdrawalAsync } from "../../feature/withdrawal/withdrawalSlice";
import { removeAmountFromWallet } from "../../feature/wallet/walletSlice";
import { FUND_TX_TYPE } from "../../utils/constant";

const Withdrawal = () => {
  const dispatch = useDispatch();
  const { userSettings = [], companyInfo } = useSelector((state) => state.user); // Default to empty array if undefined
  const {userWallet}=useSelector((state)=>state.wallet)

  const FUND_WITHDRAWAL_WALLETS = Array.isArray(userSettings)
    ? userSettings.find(
        (setting) =>
          setting?.title === "Fund" && setting?.slug === "fund_withdrawal_wallets"
      )?.value || []
    : [];

  const FUND_WITHDRAWAL_DAYS = Array.isArray(userSettings)
    ? (userSettings.find(
        (setting) =>
          setting?.title === "Fund" && setting?.slug === "fund_withdrawal_days"
      )?.value || []).filter((day) => day?.status) || []
    : [];

  const MIN_WITHDRAWAL_LIMIT = 10;
  const MAX_WITHDRAWAL_LIMIT = 1000;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const amount = watch("amount");
  const selectedWalletType = watch("walletType");

  const isWithdrawalDayAllowed = () => {
    if (FUND_WITHDRAWAL_DAYS.length === 0) return true;
    const currentDay = new Date()
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();
    return FUND_WITHDRAWAL_DAYS.some(
      (day) => day?.label?.toLowerCase() === currentDay
    );
  };

  const handleFormSubmit = async (data) => {
    const formData = {
      ...data,
      walletType: data.walletType || "main_wallet",
      txType: FUND_TX_TYPE.FUND_WITHDRAWAL,
      debitCredit: "DEBIT",
      amount: Number(data.amount),
    };

    try {
      const walletBalance =
        getWalletBalance(userWallet, formData.walletType) || 0;
      if (formData.amount > walletBalance) {
        throw new Error("Insufficient balance in selected wallet");
      }
      if (formData.amount < MIN_WITHDRAWAL_LIMIT) {
        throw new Error(`Minimum withdrawal is $${MIN_WITHDRAWAL_LIMIT}`);
      }
      if (formData.amount > MAX_WITHDRAWAL_LIMIT) {
        throw new Error(`Maximum withdrawal is $${MAX_WITHDRAWAL_LIMIT}`);
      }

      await dispatch(userFundWithdrawalAsync(formData)).unwrap();
      await dispatch(
        removeAmountFromWallet({
          amount: formData.amount,
          walletType: formData.walletType,
        })
      );
      toast.success("Withdrawal Request Submitted Successfully");
    } catch (error) {
      toast.error(error.message || "Withdrawal failed. Please try again.");
    }
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Withdrawal" />
      <div className="flex flex-col md:!flex-row items-center justify-center !mt-6 sm:!mt-8 md:!mt-10 !gap-4 sm:!gap-6 !px-4 sm:!px-6 lg:!px-8 ">
        {/* Withdrawal Info Section */}
        <div className="card-responsive">
          <div className="space-y-4">
            <div className="box-blue">
              <p className="text-responsive-semibold">
                PAYOUT PAID AMOUNT{" "}
                <span className="text-responsive-semibold">
                  {companyInfo?.CURRENCY || "$"}
                </span>
              </p>
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold">0</h4>
            </div>
            <div className="box-green">
              <p className="text-responsive-semibold ">Minimum payout amount</p>
              <h6 className="text-responsive-semibold">
                {companyInfo?.CURRENCY || "$"}
                {MIN_WITHDRAWAL_LIMIT.toFixed(2)}
              </h6>
            </div>
          </div>
          <div className="!mt-3 sm:!mt-4">
            <p className="text-responsive-medium ">Withdrawal Conditions</p>
            <p className="text-responsive-bold">
              {FUND_WITHDRAWAL_DAYS.length > 0
                ? `Available on: ${FUND_WITHDRAWAL_DAYS.map(
                    (day) => day?.label || ""
                  ).join(", ")}`
                : "All Withdrawals Available 24x7"}
            </p>
          </div>
        </div>

        {/* Withdrawal Form Section (Conditionally Rendered) */}
        {isWithdrawalDayAllowed() ? (
          <div className="card-responsive ">
            <div className="card_payout_header">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
                <h6 className="mb-0 text-base sm:text-lg md:text-xl font-bold">
                  Payout Request
                </h6>
                <p className="flex flex-wrap">
                  Withdrawal Wallet Balance:
                  <span className="wallet-balance text-green-700 !ml-1">
                    {companyInfo?.CURRENCY || "$"}
                    {getWalletBalance(userWallet, selectedWalletType)?.toFixed(2) || "0.00"}
                  </span>
                </p>
              </div>

              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-3 sm:space-y-4"
              >
                <div>
                  <label className="input-label">
                    Select Withdrawal Wallet
                  </label>
                  <select
                    {...register("walletType", {
                      required: "Please select a withdrawal wallet",
                    })}
                    className="input-field"
                  >
                    <option value="">Select Wallet</option>
                    {FUND_WITHDRAWAL_WALLETS.map((wallet) => (
                      <option key={wallet?.key} value={wallet?.key}>
                        {wallet?.label || ""}
                      </option>
                    ))}
                  </select>
                  {errors.walletType && (
                    <p className="error-message mt-1">
                      {errors.walletType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="input-label">
                    Payout Amount <span className="error-message">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter Amount"
                    className="input-field"
                    {...register("amount", {
                      required: "Amount is required",
                      min: {
                        value: MIN_WITHDRAWAL_LIMIT,
                        message: `Minimum withdrawal is $${MIN_WITHDRAWAL_LIMIT}`,
                      },
                      max: {
                        value: Math.min(
                          MAX_WITHDRAWAL_LIMIT,
                          getWalletBalance(
                            userWallet,
                            selectedWalletType || "main_wallet"
                          ) || 0
                        ),
                        message:
                          "Amount exceeds available balance or maximum limit",
                      },
                    })}
                  />
                  {amount && selectedWalletType && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-darkText mt-1">
                      Available: {companyInfo?.CURRENCY || "$"}
                      {(getWalletBalance(userWallet, selectedWalletType) || 0).toFixed(2)}
                    </p>
                  )}
                  {errors.amount && (
                    <p className="error-message mt-1">
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-darkPrimary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Submit Withdrawal"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md sm:max-w-lg bg-white dark:bg-darkCard shadow-lg rounded-lg p-4 sm:p-6 text-center">
            <h6 className="text-base sm:text-lg md:text-xl font-bold text-gray-700 dark:text-darkText">
              Withdrawal Not Available Today
            </h6>
            <p className="text-xs sm:text-sm md:text-base text-red-500 mt-2">
              Withdrawals are only allowed on:{" "}
              {FUND_WITHDRAWAL_DAYS.map((day) => day?.label || "").join(", ")}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-darkText mt-1">
              Today is {new Date().toLocaleString("en-US", { weekday: "long" })}
            </p>
          </div>
        )}
      </div>
    </MasterLayout>
  );
};

export default Withdrawal;