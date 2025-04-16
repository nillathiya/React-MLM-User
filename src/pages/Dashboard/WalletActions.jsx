import React from "react";
import { Link } from "react-router-dom";

const WalletActions = () => {
  return (
    <div className="card radius-16 !rounded-lg bg-white dark:!bg-gray-900 shadow-lg !mt-6">
      <div className="card-header !p-4 border-b border-gray-200 dark:border-gray-700">
        <h6 className="mb-0 fw-bold text-lg text-gray-800 dark:text-gray-200">
          Wallet Actions
        </h6>
      </div>
      <div className="card-body !p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/fund/addfund"
            className="flex-1 bg-blue-500 dark:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg text-center hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
          >
            Add Fund
          </Link>
          <Link
            to="/withdrawal"
            className="flex-1 bg-green-500 dark:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg text-center hover:bg-green-600 dark:hover:bg-green-700 transition-colors duration-300"
          >
            Withdraw
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WalletActions;
