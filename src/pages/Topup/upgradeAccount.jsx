import React, { useEffect, useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import "./topup.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getWalletBalance } from "../../utils/walletUtils";
import {
  createTopUpAsync,
  getPinDetailsAsync,
} from "../../feature/topup/topUpSlice";
import Loader from "../../components/common/Loader";
import { removeAmountFromWallet } from "../../feature/wallet/walletSlice";
const UpgradeAccount = () => {
  const dispatch = useDispatch();
  const { userWallet } = useSelector((state) => state.wallet);
  const { pinDetails } = useSelector((state) => state.topUp);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        dispatch(getPinDetailsAsync());
      } catch (error) {
        toast.error(error || "An Unexpected error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const handleFormSubmit = async (data) => {
    const formData = {
      ...data,
      txType: "repurchase",
    };
    try {
      await dispatch(createTopUpAsync(formData)).unwrap();
      await dispatch(
        removeAmountFromWallet({
          walletType: "Fund_wallet",
          amount: data.amount,
        })
      );
      toast.success("Topup successful!");
    } catch (error) {
      toast.error(error || "An Unexpected error");
    }
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Upgrade-Account"></Breadcrumb>
      <div className="flex justify-center items-center">
        {loading ? (
          <>
            <Loader loader="ClipLoader" size={50} color="blue" />
          </>
        ) : (
          <div className="w-full max-w-lg !px-4 py-3 !bg-white dark:!bg-darkCard shadow-lg rounded-lg">
            <h6 className="heading">Upgrade Account Form</h6>
            <div className="grid grid-cols-2 gap-4 !mb-6">
              <div className="wallet-box wallet-fund">
                <p className="wallet-title">Fund Wallet</p>
                <span className="wallet-balance">
                  ${getWalletBalance(userWallet, "fund_wallet")}
                </span>
              </div>
            </div>
            <form
              className="space-y-4"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <div>
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
                  <p className="error-message mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700  dark:text-darkText font-medium">
                  Select Package
                </label>
                <select
                  {...register("pinId", {
                    required: "Please select a package",
                  })}
                  className="input-field"
                >
                  <option value="">Select Package</option>
                  {pinDetails.length > 0 &&
                    pinDetails?.map((pinDetail) => (
                      <option key={pinDetail._id} value={pinDetail._id}>
                        {`${pinDetail.pinType} ($${pinDetail.pinRate})`}
                      </option>
                    ))}
                </select>
                {errors.pinId && (
                  <p className="error-message">{errors.pinId.message}</p>
                )}
              </div>

              <div>
                {/* Username Field */}
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="input-field"
                  {...register("amount", {
                    required: "Amount is required",
                  })}
                />
                {errors.amount && (
                  <p className="error-message mt-1">{errors.amount.message}</p>
                )}
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "TOPUP"}
              </button>
            </form>
          </div>
        )}
      </div>
    </MasterLayout>
  );
};

export default UpgradeAccount;
