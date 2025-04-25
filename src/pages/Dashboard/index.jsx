import React, { useEffect, useState, useMemo, useRef } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import useReactApexChart from "../../hook/useReactApexChart";
import DashBoardLayerOne from "../../components/DashBoardLayerOne";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "./dashboard.css";
import UserActivityCard from "./userActivityCard";
import BalanceStatistic from "./balanceStatistic";
import EarningCategories from "./EarningCategories";
// import IncomeStatistics from "./IncomeStatistics";
import TeamStatistics from "./TeamStatistics";
import Investment from "./investment";
import NewCustomerList from "./newCustomerList";
import { useDispatch } from "react-redux";
import {
  getUserWalletAsync,
  getWalletSettingsAsync,
} from "../../feature/wallet/walletSlice";
import { getUserTeamDetailsAsync } from "../../feature/team/teamSlice";
import { useSelector } from "react-redux";
import {
  getFundTransactionsByUserAsync,
  getTransactionsByUserAsync,
  selectUserFundWithdrwalHistory,
  getIncomeTransactionsByUserAsync,
} from "../../feature/transaction/transactionSlice";
import toast from "react-hot-toast";
import { getWalletBalance } from "../../utils/walletUtils";
import { INCOME_FIELDS } from "../../constants/appConstants";
import Confetti from "react-confetti";
// import { Icon } from '@iconify/react/dist/iconify.js';
import { ICON } from "../../constants/icons";
import {
  getCompanyInfoAsync,
  getUserRemainingCappingAsync,
  getUserSettingsAsync,
} from "../../feature/user/userSlice";
import { getUserOrdersAsync } from "../../feature/order/orderSlice";
import InvitationCard from "./InvitationCard";
import WalletActions from "./WalletActions";
import WelcomeCard from "./WelcomeCard";
import AccountAndWalletActions from "./AccountAndWalletActions";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentUser: loggedInUser } = useSelector((state) => state.auth);
  const { userWallet } = useSelector((state) => state.wallet);
  const { companyInfo, userSettings } = useSelector((state) => state.user);
  const {
    transactions,
    incomeTransactions = [],
    incomeTransactionsLoading,
  } = useSelector((state) => state.transaction);

  const userFundWithdrwalHistory = useSelector(selectUserFundWithdrwalHistory);

  const [copySuccess, setCopySuccess] = useState(false);
  const referralLink = `${window.location.origin}?ref=${loggedInUser?.username}`;
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef(null);

  const userRank = loggedInUser.myRank || 0;
  useEffect(() => {
    if (userRank > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [userRank]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getUserOrdersAsync(loggedInUser?._id)).unwrap();

        // if (!userWallet) {
        await dispatch(getUserWalletAsync(loggedInUser?._id)).unwrap();
        await dispatch(getUserTeamDetailsAsync(loggedInUser?._id)).unwrap();
        await dispatch(getWalletSettingsAsync()).unwrap();
        // }
        if (!companyInfo || Object.keys(companyInfo).length === 0) {
          await dispatch(getCompanyInfoAsync()).unwrap();
        }
        await dispatch(getUserRemainingCappingAsync()).unwrap();
      } catch (error) {
        toast.error(error || "Server Failed...");
      }
    };

    if (loggedInUser?._id) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (loggedInUser?._id) {
        try {
          // if (transactions.length === 0) {
          await dispatch(getFundTransactionsByUserAsync()).unwrap();
          await dispatch(getTransactionsByUserAsync()).unwrap();
          // }
          // if (incomeTransactions.length === 0) {
          await dispatch(getIncomeTransactionsByUserAsync({})).unwrap();
          // }
        } catch (error) {
          toast.error(error || "Fetched User Transaction Failed");
        }
      }
    };
    fetchTransactions();
  }, []);

  const formattedUserTotalWithdrawal = useMemo(() => {
    return parseFloat(
      userFundWithdrwalHistory
        .reduce((acc, { status, amount, txCharge, wPool }) => {
          const totalAmount = (amount ?? 0) + (txCharge ?? 0) + (wPool ?? 0);
          if (status === 1) acc += totalAmount;
          return acc;
        }, 0)
        .toFixed(2)
    );
  }, [userFundWithdrwalHistory]);

  const totalIncome = Array.isArray(incomeTransactions)
    ? incomeTransactions.reduce((acc, tx) => {
        if (tx.txType === "income" && tx.status === 1) {
          acc += tx.amount;
        }
        return acc;
      }, 0)
    : 0;

  console.log("formattedUserTotalWithdrawal", formattedUserTotalWithdrawal);
  return (
    <MasterLayout>
      <Breadcrumb title="dashboard"></Breadcrumb>

      <AccountAndWalletActions />

      <WelcomeCard />

      <UserActivityCard />

      <div className="mt-24">
        <div className="row gy-4">
          <div className="col-xl-8">
            <div className="row gy-4">
              {/* EarningCategories */}
              <EarningCategories />

              {/* ExpenseStatistics */}
              <TeamStatistics />
            </div>
            <div className="col-12 !mt-5">
              <div className="card radius-12">
                <div className="card-body p-16">
                  <div className="row gy-4">
                    {/* Main Wallet  */}
                    <div className="col-xxl-4 col-xl-4 col-sm-6">
                      <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-1 left-line line-bg-primary position-relative overflow-hidden">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                          <div>
                            <h6 className="mb-2 fw-medium">Main Wallet</h6>
                          </div>
                        </div>
                        <div className="d-flexy">
                          <h6 className="text-secondary-light">
                            {companyInfo.CURRENCY}
                            {getWalletBalance(
                              userWallet,
                              "main_wallet"
                            ).toFixed(2)}
                          </h6>
                        </div>
                      </div>
                    </div>
                    {/* Fund Wallet */}
                    <div className="col-xxl-4 col-xl-4 col-sm-6">
                      <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-1 left-line line-bg-warning position-relative overflow-hidden">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                          <div>
                            <h6 className="mb-2 fw-medium">Fund Wallet</h6>
                          </div>
                        </div>
                        <div className="d-flex">
                          <h6 className="text-secondary-light">
                            {companyInfo.CURRENCY}
                            {getWalletBalance(
                              userWallet,
                              "fund_wallet"
                            ).toFixed(2)}
                          </h6>
                        </div>
                      </div>
                    </div>
                    {/* Weekly Pool */}
                    <div className="col-xxl-4 col-xl-4 col-sm-6">
                      <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-1 left-line line-bg-warning position-relative overflow-hidden">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                          <div>
                            <h6 className="mb-2 fw-medium">Weekly Pool</h6>
                          </div>
                        </div>
                        <div className="d-flex">
                          <h6 className="text-secondary-light">
                            {companyInfo.CURRENCY}
                            {getWalletBalance(
                              userWallet,
                              "weekly_pool"
                            ).toFixed(2)}
                          </h6>
                        </div>
                      </div>
                    </div>
                    {/* Monthly Pool */}
                    <div className="col-xxl-4 col-xl-4 col-sm-6">
                      <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-1 left-line line-bg-warning position-relative overflow-hidden">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                          <div>
                            <h6 className="mb-2 fw-medium">Monthly Pool</h6>
                          </div>
                        </div>
                        <div className="d-flex">
                          <h6 className="text-secondary-light">
                            {companyInfo.CURRENCY}
                            {getWalletBalance(
                              userWallet,
                              "monthly_pool"
                            ).toFixed(2)}
                          </h6>
                        </div>
                      </div>
                    </div>
                    {/* Instant Pool  */}
                    <div className="col-xxl-4 col-xl-4 col-sm-6">
                      <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-2 left-line line-bg-lilac position-relative overflow-hidden">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                          <div>
                            <div>
                              <h6 className="mb-2 fw-medium">
                                Direct Referral Income
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex">
                          <h6 className="text-secondary-light">
                            {companyInfo.CURRENCY}
                            {getWalletBalance(userWallet, "direct").toFixed(2)}
                          </h6>
                        </div>
                      </div>
                    </div>
                    {/* Total Withdrawal */}
                    <div className="col-xxl-4 col-xl-4 col-sm-6">
                      <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-2  left-line line-bg-success position-relative overflow-hidden">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                          <div>
                            <h6 className="mb-2 fw-medium">Total Withdrawal</h6>
                          </div>
                        </div>
                        <div className="d-flex">
                          <h6 className="text-secondary-light">
                            {companyInfo.CURRENCY}
                            {formattedUserTotalWithdrawal}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* User Rank  */}
            <div
              ref={confettiRef}
              className="card radius-16 mt-3 relative overflow-hidden"
            >
              {/* Confetti only inside this div */}
              {showConfetti && confettiRef.current && (
                <Confetti
                  width={confettiRef.current.offsetWidth}
                  height={confettiRef.current.offsetHeight}
                  numberOfPieces={150} // Limit the number of confetti
                  recycle={false}
                />
              )}

              <div className="card-header">
                <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                  <h6 className="mb-2 fw-bold text-lg">User Rank</h6>
                </div>
              </div>

              <div className="card-body p-0">
                <div className="p-20">
                  <div className="position-relative z-1 py-32 text-center px-3">
                    <img
                      src="assets/images/nft/nft-gradient-bg.png"
                      alt=""
                      className="position-absolute top-0 start-0 w-100 h-100 z-n1"
                    />
                    <div className="relative flex items-center justify-center">
                      {/* Trophy Icon */}
                      <Icon
                        icon={ICON.TROPHY}
                        width={100}
                        height={100}
                        className="text-yellow-500 text-5xl"
                      />

                      {/* Rank Above Trophy */}
                      <span className="absolute top-[12px] text-2xl font-bold text-white">
                        {userRank}
                      </span>
                    </div>

                    <span className="text-white font-semibold">Your Rank</span>
                  </div>
                </div>
              </div>
            </div>
            {/* User Rank End */}
          </div>
          {/* Sidebar start */}
          <div className="col-xl-4">
            {/* QuickTransfer */}
            <InvitationCard />

            {/* WalletActions */}
            {/* <WalletActions /> */}

            {/* <div className="card radius-16">
              <div className="card-header">
                <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                  <h6 className="mb-2 fw-bold text-lg">Referral link</h6>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="p-20">
                  <div className="position-relative z-1 py-32 text-center px-3">
                    <img
                      src="assets/images/home-eleven/bg/bg-orange-gradient.png"
                      alt=""
                      className="position-absolute top-0 start-0 w-100 h-100 z-n1"
                    />
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="copy-input !text-gray-900"
                    />
                    <button
                      className="copy-btn !text-green-900"
                      onClick={handleCopy}
                    >
                      Copy Link
                    </button>
                  </div>
                  {copySuccess && <p className="copy-success">Link copied!</p>}
                </div>
              </div>
            </div> */}

            {/* Investment */}
            <Investment />
          </div>
          {/* Sidebar end */}
        </div>
      </div>
      <div className="mt-24">
        <div className="row gy-4">
          <div className="col-xxl-12 col-xl-12 col-md-12">
            <BalanceStatistic />
          </div>
        </div>
      </div>
      <NewCustomerList />
    </MasterLayout>
  );
};

export default Dashboard;
