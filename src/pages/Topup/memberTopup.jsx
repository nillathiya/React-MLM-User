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
import {
  getUserWalletAsync,
  removeAmountFromWallet,
} from "../../feature/wallet/walletSlice";
import { checkUsernameAsync } from "../../feature/user/userSlice";
import { getNameBySlugFromWalletSetting } from "../../utils/common";

const MemberTopup = () => {
  const [usernameValid, setUsernameValid] = useState(null);
  const [userActiveStatus, setUserActiveStatus] = useState(null);
  const dispatch = useDispatch();
  const { userWallet, walletSettings } = useSelector((state) => state.wallet);
  const { pinDetails } = useSelector((state) => state.topUp);
  const [loading, setLoading] = useState(false);

  const { userSettings = [], companyInfo } = useSelector((state) => state.user);

  const investmentWalletType =
    userSettings.find(
      (setting) =>
        setting.title === "Investment" && setting.slug === "topup_fund_wallet"
    )?.value || {};
  const investmentWalletName = getNameBySlugFromWalletSetting(
    walletSettings,
    investmentWalletType
  );

  const FIXED_AMOUNT = 100; // Fixed package amount

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      amount: FIXED_AMOUNT, // Set default amount to 100
    },
  });

  const username = watch("username");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        dispatch(getPinDetailsAsync());
        dispatch(getUserWalletAsync());
      } catch (error) {
        toast.error(error || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  // Check username validity
  useEffect(() => {
    const checkUsername = async () => {
      if (!username) return;
      try {
        const formData = { username };
        const response = await dispatch(checkUsernameAsync(formData)).unwrap();
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
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [username, setError, clearErrors]);

  const handleFormSubmit = async (data) => {
    if (!usernameValid) {
      toast.error("Please enter a valid username");
      return;
    }

    const balance = getWalletBalance(userWallet, investmentWalletType) || 0;
    if (balance < FIXED_AMOUNT) {
      toast.error("Insufficient funds in Investment Wallet");
      return;
    }

    const formData = {
      username: data.username,
      amount: FIXED_AMOUNT,
      pinId: pinDetails[0]._id,
      txType: userActiveStatus === 0 ? "purchase" : "repurchase",
    };

    try {
      await dispatch(createTopUpAsync(formData)).unwrap();
      await dispatch(
        removeAmountFromWallet({
          walletType: investmentWalletType,
          amount: FIXED_AMOUNT,
        })
      );
      toast.success("Topup successful!");
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="animate-pulse w-full max-w-lg px-4 py-3 bg-white dark:bg-darkCard shadow-lg rounded-lg">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <MasterLayout>
      <Breadcrumb title="Member Topup" />
      <div className="flex justify-center items-center">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="w-full max-w-lg !px-4 py-3 !bg-white dark:!bg-darkCard shadow-lg rounded-lg">
            <h6 className="heading">TopUp Form</h6>
            <div className="grid grid-cols-2 gap-4 !mb-6">
              <div className="wallet-box wallet-fund">
                <p className="wallet-title">
                  {investmentWalletName || "Investment Wallet"}
                </p>
                <span className="wallet-balance">
                  {companyInfo.CURRENCY}
                  {getWalletBalance(userWallet, investmentWalletType) || "0.00"}
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
                {/* Package Display (Non-selectable) */}
                <label>Package</label>
                <div className="input-field bg-gray-100 cursor-not-allowed text-gray-700 font-medium">
                  {companyInfo.CURRENCY}100
                </div>
              </div>

              <div>
                {/* Amount Field (Fixed and Disabled) */}
                <label>Amount</label>
                <input
                  type="number"
                  value={FIXED_AMOUNT}
                  disabled
                  className="input-field bg-gray-100 cursor-not-allowed"
                  {...register("amount", {
                    required: "Amount is required",
                    value: FIXED_AMOUNT,
                  })}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : userActiveStatus === 0
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
