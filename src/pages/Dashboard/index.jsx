import React, { useEffect, useState } from "react";
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
import ExpenseStatistics from "./ExpenseStatistics";
import Investment from "./investment";
import NewCustomerList from "./newCustomerList";
import { useDispatch } from "react-redux";
import { getUserWalletAsync } from "../../feature/wallet/walletSlice";
import { useSelector } from "react-redux";
import {
  getFundTransactionsByUserAsync,
  getTransactionsByUserAsync,
} from "../../feature/transaction/transactionSlice";
import toast from "react-hot-toast";
const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentUser: loggedInUser } = useSelector((state) => state.auth);
  const { userWallet } = useSelector((state) => state.wallet);
  const { transactions } = useSelector((state) => state.transaction);
  const [copySuccess, setCopySuccess] = useState(false);
  const referralLink = "https://test.arbstake.com/register?ref=arbstake";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  console.log("LoggedInUserId", loggedInUser?._id);
  useEffect(() => {
    if (!userWallet && loggedInUser?._id) {
      dispatch(getUserWalletAsync(loggedInUser?._id));
    }
  }, [userWallet, loggedInUser?._id, dispatch]);

  useEffect(() => {
    (async () => {
      if (transactions.length === 0 && loggedInUser?._id) {
        try {
          await dispatch(getFundTransactionsByUserAsync()).unwrap();
          await dispatch(getTransactionsByUserAsync()).unwrap();
        } catch (error) {
          toast.error(error || "Fetched User Transaction Failed");
        }
      }
    })();
  }, [transactions, loggedInUser?._id, dispatch]);

  return (
    <MasterLayout>
      <Breadcrumb title="dashboard"></Breadcrumb>

      <UserActivityCard />

      <div className="mt-24">
        <div className="row gy-4">
          <div className="col-xl-8">
            <div className="row gy-4">
              {/* BalanceStatistic */}
              <BalanceStatistic />

              {/* EarningCategories */}
              <EarningCategories />

              {/* ExpenseStatistics */}
              <ExpenseStatistics />
            </div>
            <div className="col-12 mt-5">
              <div className="card radius-12">
                <div className="card-body p-16">
                  <div className="row gy-4">
                    <div className="col-xxl-4 col-xl-4 col-sm-6">
                      <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-1 left-line line-bg-primary position-relative overflow-hidden">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                          <div>
                            <h6 className="mb-2 fw-medium">Main Wallet</h6>
                          </div>
                        </div>
                        <div className="d-flex justify-content-evenly mt-5">
                          <h6 className="text-secondary-light">$ 610.4</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-sm-6">
                      <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-2 left-line line-bg-lilac position-relative overflow-hidden">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                          <div>
                            <div>
                              <h6 className="mb-2 fw-medium">Total Income</h6>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-evenly mt-5">
                          <h6 className="text-secondary-light">$ 678.4325</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-sm-6">
                      <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-two-4 left-line line-bg-success position-relative overflow-hidden">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                          <div>
                            <h6 className="mb-2 fw-medium">Total Withdrawal</h6>
                          </div>
                        </div>
                        <div className="d-flex justify-content-evenly mt-5">
                          <h6 className="text-secondary-light">$ 0</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar start */}
          <div className="col-xl-4">
            {/* QuickTransfer */}

            <div className="card radius-16">
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
                      className="dark:text-red-600 copy-input"
                    />
                    <button className="copy-btn" onClick={handleCopy}>
                      Copy Link
                    </button>
                  </div>
                  {copySuccess && <p className="copy-success">Link copied!</p>}
                </div>
              </div>
            </div>

            {/* Investment */}
            <Investment />

            <div className="card radius-16 mt-5">
              <div className="card-header">
                <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                  <h6 className="mb-2 fw-bold text-lg">Quick Transfer</h6>
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
                    <h3 className="text-white">$500.00</h3>
                    <span className="text-white">Your Balance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar end */}
        </div>
      </div>

      <NewCustomerList />
    </MasterLayout>
  );
};

export default Dashboard;
