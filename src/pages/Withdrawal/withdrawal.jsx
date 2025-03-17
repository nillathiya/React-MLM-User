import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import MasterLayout from "../../masterLayout/MasterLayout";
import "./withdrawal.css";
import { getWalletBalance } from "../../utils/walletUtils";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { userFundWithdrawalAsync } from "../../feature/withdrawal/withdrawalSlice";
import { removeAmountFromWallet } from "../../feature/wallet/walletSlice";
import { safeParseJSON } from "../../utils/common";

const Withdrawal = () => {
  const dispatch = useDispatch();
  const { userWallet } = useSelector((state) => state.wallet);
  const { userSettings, companyInfo } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const amount = watch("amount");
  const selectedWalletType = watch("walletType");

  const {
    MIN_WITHDRAWAL_LIMIT,
    MAX_WITHDRAWAL_LIMIT,
    WITHDRAWAL_WALLETS,
    WD_DAYS,
  } = React.useMemo(() => {
    const parsedWithdrawalWallet = safeParseJSON(
      userSettings?.WITHDRAWAL_WALLETS
    );
    const parsedWithdrawalDays = safeParseJSON(userSettings?.WD_DAYS);
    return {
      MIN_WITHDRAWAL_LIMIT:
        Number(safeParseJSON(userSettings?.MIN_WITHDRAWAL_LIMIT)) || 0,
      MAX_WITHDRAWAL_LIMIT:
        Number(safeParseJSON(userSettings?.MAX_WITHDRAWAL_LIMIT)) || Infinity,
      WITHDRAWAL_WALLETS: Array.isArray(parsedWithdrawalWallet)
        ? parsedWithdrawalWallet
        : parsedWithdrawalWallet
        ? [parsedWithdrawalWallet]
        : [],
      WD_DAYS: Array.isArray(parsedWithdrawalDays)
        ? parsedWithdrawalDays
        : parsedWithdrawalDays
        ? [parsedWithdrawalDays]
        : [],
    };
  }, [
    userSettings?.MIN_WITHDRAWAL_LIMIT,
    userSettings?.MAX_WITHDRAWAL_LIMIT,
    userSettings?.WITHDRAWAL_WALLETS,
    userSettings?.WD_DAYS,
  ]);

  const isWithdrawalDayAllowed = () => {
    if (WD_DAYS.length === 0) return true;
    const currentDay = new Date().toLocaleString("en-US", { weekday: "long" });
    return WD_DAYS.map((day) => day.toLowerCase()).includes(
      currentDay.toLowerCase()
    );
  };

  const handleFormSubmit = async (data) => {
    const formData = {
      ...data,
      walletType: data.walletType || "main_wallet", // Fallback to main_wallet
      txType: "user_fund_withdrawal",
      debitCredit: "DEBIT",
      amount: Number(data.amount),
    };

    try {
      if (!isWithdrawalDayAllowed()) {
        throw new Error(
          `Withdrawals are only allowed on: ${WD_DAYS.join(
            ", "
          )}. Today is ${new Date().toLocaleString("en-US", {
            weekday: "long",
          })}`
        );
      }

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
      <div className="flex flex-col md:flex-row items-center justify-center mt-10 gap-6 withdrawal_response">
        {/* Withdrawal Info Section */}
        <div className="w-full max-w-lg bg-white dark:bg-darkCard shadow-lg rounded-lg !p-6">
          <div className="withdrawal_inner_section">
            <div className="withdrawal_payout_amount wallet-box wallet-main">
              <h6>
                PAYOUT PAID AMOUNT<span>{companyInfo.CURRENCY}</span>
              </h6>
              <h4>0</h4>
            </div>
            <div className="withdrawal_payout_Minimum_amount wallet-box wallet-fund">
              <p className="minimum_payout_amount">Minimum payout amount</p>
              <h6>
                {companyInfo.CURRENCY}
                {MIN_WITHDRAWAL_LIMIT.toFixed(2)}
              </h6>
            </div>
          </div>
          <div className="withdrawal_condition !mt-4">
            <p className="minimum_amount">Withdrawal Conditions</p>
            <p className="all_available font-bold">
              {WD_DAYS.length > 0
                ? `Available on: ${WD_DAYS.join(", ")}`
                : "All Withdrawals Available 24x7"}
            </p>
          </div>
        </div>

        {/* Withdrawal Form Section */}
        <div className="w-full max-w-lg bg-white dark:bg-darkCard shadow-lg rounded-lg p-6 responsive_request_section">
          <div className="card_payout_header">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h6 className="mb-0 fw-bold text-lg">Payout Request</h6>
              <p className="mb-0">
                Main Wallet:
                <span className="text-green-600 font-medium">
                  {companyInfo.CURRENCY}
                  {getWalletBalance(userWallet, "main_wallet")?.toFixed(2) ||
                    "0.00"}
                </span>
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 dark:text-darkText font-medium mb-1">
                  Select Withdrawal Wallet
                </label>
                <select
                  {...register("walletType", {
                    required: "Please select a withdrawal wallet",
                  })}
                  className="w-full p-3 border border-gray-300 dark:border-darkBorder rounded-lg 
                    bg-gray-50 dark:bg-darkCard text-gray-800 dark:text-darkText focus:ring-2 focus:ring-darkPrimary"
                >
                  <option value="">Select Wallet</option>
                  {WITHDRAWAL_WALLETS.map((walletObj, index) =>
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
                  Payout Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter Amount"
                  className="w-full p-3 border border-gray-300 dark:border-darkBorder rounded-lg 
                    bg-gray-50 dark:bg-darkCard text-gray-800 dark:text-darkText focus:ring-2 focus:ring-darkPrimary"
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
                  <p className="text-sm text-gray-600 dark:text-darkText mt-1">
                    Available: {companyInfo.CURRENCY}
                    {(
                      getWalletBalance(userWallet, selectedWalletType) || 0
                    ).toFixed(2)}
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
                  disabled:bg-gray-400 disabled:cursor-not-allowed withdrawal_btn text-center"
                disabled={
                  isSubmitting ||
                  (WD_DAYS.length > 0 && !isWithdrawalDayAllowed())
                }
              >
                {isSubmitting ? "Processing..." : "Submit Withdrawal"}
              </button>
              {WD_DAYS.length > 0 && !isWithdrawalDayAllowed() && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  Withdrawals are only allowed on: {WD_DAYS.join(", ")}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default Withdrawal;
