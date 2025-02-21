import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import "./fund.css";
import { useSelector, useDispatch } from "react-redux";
import { getWalletBalance } from "../../utils/walletUtils";
import { useForm } from "react-hook-form";
import { userFundTransferAsync } from "../../feature/transaction/transactionSlice";
import { removeAmountFromWallet } from "../../feature/wallet/walletSlice";
import toast from "react-hot-toast";

const TransferFund = () => {
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
      walletType: "fund_wallet",
      txType: "user_fund_transfer",
    };
    try {
      await dispatch(userFundTransferAsync(formData)).unwrap();
      await dispatch(
        removeAmountFromWallet({
          walletType: "fund_wallet",
          amount: data.amount,
        })
      );

      toast.success("Fund Successfully Transferred");
    } catch (error) {
      toast.error(error || "Send Fund Failed, Please try again later.");
    }
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Transfer Fund" />
      <div className="add_fund_sec">
        <form
          className="flex flex-col gap-1 fund-form"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <h6 className="fund_wallet_show">
            Fund Wallet:{" "}
            <span>${getWalletBalance(userWallet, "fund_wallet")}</span>
          </h6>

          {/* Username Field */}
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            className="input-field"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
          />
          {errors.username && (
            <p className="error-message mt-1">{errors.username.message}</p>
          )}

          {/* Amount Field */}
          <label>Enter Amount</label>
          <input
            type="number"
            placeholder="Enter Amount"
            className="input-field"
            {...register("amount", {
              required: "Amount is required",
              min: {
                value: 1,
                message: "Amount must be at least $1",
              },
            })}
          />
          {errors.amount && (
            <p className="error-message mt-1">{errors.amount.message}</p>
          )}

          {/* Submit Button */}
          <button
            className="connect-wallet-btn mt-3"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Transfer"}
          </button>
        </form>
      </div>
    </MasterLayout>
  );
};

export default TransferFund;
