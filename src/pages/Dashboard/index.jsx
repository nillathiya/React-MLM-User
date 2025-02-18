import React, { useState } from "react";
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
import ConnectWallet from "../../components/wallet/ConnectWallet";
import { useAccount } from "wagmi";
const Dashboard = () => {
  const [copySuccess, setCopySuccess] = useState(false);
  const referralLink = "https://test.arbstake.com/register?ref=arbstake";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const { isConnected } = useAccount();
  console.log("isConnected", isConnected);

  return (
    <>
      <MasterLayout>
        {!isConnected ? (
          <>
            <div className="lg:ml-[265px] lg:max-w-full">
              <div className="lg:mx-auto">
                <div className="lg:container lg:mx-auto sm:mx-5  mt-3 md:p-4 p-5 ">
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setConnectWalletModal(true)}
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition focus:outline-none w-full text-center"
                    >
                      Connect Wallet
                    </button>
                    {connectWalletModal && (
                      <ConnectWallet
                        setConnectWalletModal={setConnectWalletModal}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
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
                                  <h6 className="mb-2 fw-medium">
                                    Main Wallet
                                  </h6>
                                </div>
                              </div>
                              <div className="d-flex justify-content-evenly mt-5">
                                <h6 className="text-secondary-light">
                                  $ 610.4
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-xl-4 col-sm-6">
                            <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-2 left-line line-bg-lilac position-relative overflow-hidden">
                              <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                <div>
                                  <div>
                                    <h6 className="mb-2 fw-medium">
                                      Total Income
                                    </h6>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex justify-content-evenly mt-5">
                                <h6 className="text-secondary-light">
                                  $ 678.4325
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-xl-4 col-sm-6">
                            <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-two-4 left-line line-bg-success position-relative overflow-hidden">
                              <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                <div>
                                  <h6 className="mb-2 fw-medium">
                                    Total Withdrawal
                                  </h6>
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
                        <h6 className="mb-2 fw-bold text-lg mb-0">
                          Referral link
                        </h6>
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
                        {copySuccess && (
                          <p className="copy-success">Link copied!</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Investment */}
                  <Investment />

                  <div className="card radius-16 mt-5">
                    <div className="card-header">
                      <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 className="mb-2 fw-bold text-lg mb-0">
                          Quick Transfer
                        </h6>
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
          </>
        )}
      </MasterLayout>
    </>
  );
};

export default Dashboard;
