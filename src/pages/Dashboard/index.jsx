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
import { useAccount } from 'wagmi';
const Dashboard = () => {
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const {isConnected}=useAccount();
  console.log("isConnected",isConnected);

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
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition focus:outline-none w-full text-base text-center"
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
                </div>
                {/* Sidebar start */}
                <div className="col-xl-4">
                  {/* QuickTransfer */}
                  <div className="card radius-16">
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
                            src="assets/images/home-eleven/bg/bg-orange-gradient.png"
                            alt=""
                            className="position-absolute top-0 start-0 w-100 h-100 z-n1"
                          />
                          <h3 className="text-white">$500.00</h3>
                          <span className="text-white">Your Balance</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Investment */}
                  <Investment />
                </div>
                {/* Sidebar end */}
              </div>
            </div>
            <div className="col-12 mt-5">
              <div className="card radius-12">
                <div className="card-body p-16">
                  <div className="row gy-4">
                    <div className="col-xxl-4 col-xl-4 col-sm-6">
                      <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-1 left-line line-bg-primary position-relative overflow-hidden">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                          <div>
                            <h5 className="mb-2 fw-medium">Withdrawal</h5>
                          </div>
                          <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-2xl mb-12 bg-primary-100 text-primary-600">
                            <i className="ri-shopping-cart-fill" />
                          </span>
                        </div>
                        <div className="d-flex justify-content-evenly mt-5">
                          <h6 className="text-secondary-light">Approved</h6>
                          <span>|</span>
                          <h6 className="text-secondary-light">0</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-sm-6">
                      <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-2 left-line line-bg-lilac position-relative overflow-hidden">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                          <div>
                            <div>
                              <h5 className="mb-2 fw-medium">Withdrawal</h5>
                            </div>
                          </div>
                          <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-2xl mb-12 bg-lilac-200 text-lilac-600">
                            <i className="ri-handbag-fill" />
                          </span>
                        </div>
                        <div className="d-flex justify-content-evenly mt-5">
                          <h6 className="text-secondary-light">Pending</h6>
                          <span>|</span>
                          <h6 className="text-secondary-light">0</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-sm-6">
                      <div className="px-20 py-16 shadow-none radius-8 h-100 gradient-deep-two-2 left-line line-bg-success position-relative overflow-hidden">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                          <div>
                            <h5 className="mb-2 fw-medium">Withdrawal</h5>
                          </div>
                          <span className="w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-2xl mb-12 bg-success-200 text-success-600">
                            <i className="ri-shopping-cart-fill" />
                          </span>
                        </div>
                        <div className="d-flex justify-content-evenly mt-5">
                          <h6 className="text-secondary-light">Rejected</h6>
                          <span>|</span>
                          <h6 className="text-secondary-light">0</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
