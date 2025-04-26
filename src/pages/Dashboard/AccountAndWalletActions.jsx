import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Skeleton from "../../helper/Skeleton/Skeleton";

const AccountAndWalletActions = () => {
  const { incomeTransactions = [], incomeTransactionsLoading } = useSelector(
    (state) => state.transaction
  );
  const netIncome =
    incomeTransactions?.reduce((acc, tx) => acc + tx.amount, 0) || 0;

  return (
    <div className="w-full mx-auto">
      {/* Combined Account Balance and Actions Row */}
      <div className="card-body flex flex-col lg:flex-row items-stretch gap-4 md:gap-6  rounded-2xl  !p-6">
        {/* Account Balance Section */}
        <div className="flex-1 min-w-[200px] flex flex-col justify-center text-left">
          <h3 className="text-2xl sm:text-3xl font-semibold mb-2">
            Total Profit
          </h3>
          {incomeTransactionsLoading ? (
            <Skeleton width="100px" height="28px" className="block mt-2" />
          ) : (
            <span className="text-lg sm:text-xl font-bold dark:text-gray-400">
              ${netIncome.toFixed(2)}
            </span>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex-1 flex sm:flex-row gap-2 sm:gap-4 md:gap-6 border-l-0 sm:border-l border-gray-400 pl-0 sm:pl-6">
          {/* Add Fund Card */}
          <Link
            to="/fund/addfund"
            className="group relative flex-1 p-4 rounded-xl transition-all duration-300 dark:hover:bg-gray-700 hover:bg-gray-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-1 sm:!p-3 rounded-full mb-3 transition-colors border border-gray-300 dark:group-hover:bg-gray-800 bg-blue-500 dark:bg-transparent">
                <img
                  src="assets/images/home-eleven/icons/home-eleven-icon1.svg"
                  alt="Deposit"
                  className="w-5 h-5 sm:w-7 sm:h-7 object-contain"
                />
              </div>
              <span className="!text-xs sm:!text-sm md:!text-base !font-medium !text-gray-900 dark:!text-gray-200 group-hover:text-indigo-600 transition-colors">
                Deposit
              </span>
            </div>
          </Link>

          {/* Fund Convert */}
          <Link
            to="/fund/fund-convert"
            className="group relative flex-1 p-4 rounded-xl transition-all duration-300 dark:hover:bg-gray-700 hover:bg-gray-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-1 sm:!p-3  rounded-full mb-3 transition-colors border border-gray-300 dark:group-hover:bg-gray-800 bg-yellow-500 dark:bg-transparent">
                <img
                  src="assets/images/home-eleven/icons/home-eleven-icon3.svg"
                  alt="Add Fund"
                  className="w-5 h-5 sm:w-7 sm:h-7 object-contain"
                />
              </div>
              <span className="!text-xs sm:!text-sm md:!text-base !font-medium !text-gray-900 dark:!text-gray-200 group-hover:text-indigo-600 transition-colors">
                Convert
              </span>
            </div>
          </Link>

          {/* Fund Transfer */}
          <Link
            to="/fund/transfer-fund"
            className="group relative flex-1 p-4 rounded-xl transition-all duration-300 dark:hover:bg-gray-700 hover:bg-gray-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-1 sm:!p-3  rounded-full mb-3 transition-colors border border-gray-300 dark:group-hover:bg-gray-800 bg-green-500 dark:bg-transparent">
                <img
                  src="assets/images/home-eleven/icons/home-eleven-icon2.svg"
                  alt="Add Fund"
                  className="w-5 h-5 sm:w-7 sm:h-7 object-contain"
                />
              </div>
              <span className="!text-xs sm:!text-sm md:!text-base !font-medium !text-gray-900 dark:!text-gray-200 group-hover:text-indigo-600 transition-colors">
                Transfer
              </span>
            </div>
          </Link>

          {/* Withdraw Card */}
          <Link
            to="/withdrawal"
            className="group relative flex-1 p-4 rounded-xl transition-all duration-300 dark:hover:bg-gray-700 hover:bg-gray-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-1 sm:!p-3  rounded-full mb-3 transition-colors border border-gray-300 dark:group-hover:bg-gray-800 bg-indigo-500 dark:bg-transparent">
                <img
                  src="assets/images/home-eleven/icons/home-eleven-icon4.svg"
                  alt="Add Fund"
                  className="w-5 h-5 sm:w-7 sm:h-7 object-contain"
                />
              </div>
              <span className="!text-xs sm:!text-sm md:!text-base !font-medium !text-gray-900 dark:!text-gray-200 group-hover:text-indigo-600 transition-colors">
                Withdraw
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountAndWalletActions;
