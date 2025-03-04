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

const Withdrawal = () => {
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
      walletType: "main_wallet",
      txType: "user_fund_withdrawal",
      debitCredit: "DEBIT",
    };

    try {
      await dispatch(userFundWithdrawalAsync(formData)).unwrap();
      await dispatch(
        removeAmountFromWallet({
          amount: data.amount,
          walletType: "main_wallet",
        })
      );
      toast.success("Withdrawal Successful");
    } catch (error) {
      toast.error(error || "Unexpected Error");
    }
  };

  return (
    <MasterLayout>
      <Breadcrumb PageHeading="Withdrawal" title="Fund Transfer History" />
      <div className="withdrawal_main">
        <div className="radius-16">
          <div className="p-0">
            <div className="p-20">
              <div className="position-relative z-1 py-32 text-center px-3">
                <img
                  src="assets/images/home-eleven/bg/bg-orange-gradient.png"
                  alt=""
                  className="position-absolute top-0 start-0 w-100 h-100 z-n1"
                />
                <div className="withdrawal_condition_section">
                  <div className="withdrawal_inner_section">
                    <div>
                      <h6 style={{ color: "white" }}>PAYOUT PAID AMOUNT</h6>
                      <h4>0</h4>
                    </div>
                    <div className="withdrawal_show_payment">$</div>
                  </div>
                  <div className="withdrawal_minimum_payout">
                    <div>
                      <p
                        className="minimum_payout_amount"
                        style={{ color: "white", fontSize: "20px" }}
                      >
                        Minimum payout amount
                      </p>
                      <h6 style={{ fontWeight: "bold" }}>$ 10</h6>
                    </div>
                    <div style={{ marginLeft: "30px" }}>
                      <p
                        className="minimum_amount"
                        style={{ color: "white", fontSize: "20px" }}
                      >
                        Withdrawal Conditions
                      </p>
                      <p
                        className="all_available"
                        style={{ fontWeight: "bold" }}
                      >
                        All the Withdrawals Available 24x7
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="withdrawal_payout_request mt-5">
          <div className="card_payout_header">
            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
              <h6 className="mb-2 fw-bold text-lg mb-0 text-white">
                Payout Request
              </h6>
              <p className="text-white">
                Main Wallet :
                <span style={{ color: "green" }}>
                  {" "}
                  ${getWalletBalance(userWallet, "main_wallet")}
                </span>
              </p>
              {/* <p className="text-white">
                Fund Wallet :
                <span style={{ color: "green" }}>
                  {" "}
                  ${getWalletBalance(userWallet, "fund_wallet")}
                </span>
              </p> */}
            </div>
            <div className="p-0">
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <label className="text-white">PAYOUT AMOUNT *</label>
                <input
                  type="number"
                  className="payout_amount_input"
                  {...register("amount", {
                    required: "Amount is required",
                    min: {
                      value: 10,
                      message: "Amount should be at least $10",
                    },
                    max: {
                      value: getWalletBalance(userWallet, "main_wallet"),
                      message:
                        "Amount should not exceed your main wallet balance",
                    },
                  })}
                />
                {errors.amount && (
                  <p className="error-message">{errors.amount.message}</p>
                )}
                <br />
                <button
                  type="submit"
                  className="withdrawal_btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default Withdrawal;
