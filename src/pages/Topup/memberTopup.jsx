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
import { checkUsernameAsync } from "../../feature/user/userSlice";
const MemberTopup = () => {
  const [usernameValid, setUsernameValid] = useState(null);
  const [userActiveStatus, setUserActiveStatus] = useState(null);
  const dispatch = useDispatch();
  const { userWallet } = useSelector((state) => state.wallet);
  const { pinDetails } = useSelector((state) => state.topUp);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const username = watch("username"); // Watch username field

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

  // Function to check username validity
  useEffect(() => {
    const checkUsername = async () => {
      if (!username) return;
      try {
        const formData = {
          username,
        };
        const response = await dispatch(checkUsernameAsync(formData)).unwrap();
        console.log(response)
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
        setError("username", { type: "manual", message: "Username not found" });
      }
    };

    const delayDebounce = setTimeout(() => {
      checkUsername();
    }, 500); // Debounce API call

    return () => clearTimeout(delayDebounce);
  }, [username, setError, clearErrors]);

  const handleFormSubmit = async (data) => {
    if (!usernameValid) {
      toast.error("Please enter a valid username");
      return;
    }

    const formData = {
      ...data,
      txType: "purchase",
    };
    try {
      await dispatch(createTopUpAsync(formData)).unwrap();
      await dispatch(
        removeAmountFromWallet({
          walletType: "fund_wallet",
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
      <Breadcrumb title="member Topup"></Breadcrumb>
      <div className="flex justify-center items-center">
        {loading ? (
          <>
            <Loader loader="ClipLoader" size={50} color="blue" />
          </>
        ) : (
          <div className="w-full max-w-lg !px-4 py-3 !bg-white dark:!bg-darkCard shadow-lg rounded-lg">
            <h6 className="heading">TopUp Form</h6>
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
                  <p className="error-message">{errors.username.message}</p>
                )}
                {usernameValid && (
                  <p className="text-green-500">✅ Username is valid</p>
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
                {isSubmitting
                  ? "Processing..."
                  : userActiveStatus == 0
                  ? "TOPUP"
                  : "UPGRADE"}
              </button>
            </form>
          </div>
        )}
      </div>
    </MasterLayout>
  );
};

export default MemberTopup;
