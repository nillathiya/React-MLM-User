import React, { useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs"; // For date filtering

const Investment = () => {
  const { userOrders = [] } = useSelector((state) => state.orders);
  const {
    incomeTransactions = [],
    selectUserFundWithdrwalHistory: userFundWithdrawal = [],
  } = useSelector((state) => state.transaction);

  const [filter, setFilter] = useState("Today");

  const filterOrders = (orders, range) => {
    const now = dayjs();
    return orders?.filter((order) => {
      const orderDate = dayjs(order.createdAt);
      switch (range) {
        case "Today":
          return orderDate.isSame(now, "day");
        case "Weekly":
          return orderDate.isAfter(now.subtract(7, "day"));
        case "Monthly":
          return orderDate.isAfter(now.subtract(1, "month"));
        case "Yearly":
          return orderDate.isAfter(now.subtract(1, "year"));
        default:
          return true;
      }
    });
  };

  // Calculate total investment based on the selected filter
  const totalInvestment =
    filterOrders(userOrders, filter)?.reduce(
      (acc, order) => acc + order.amount,
      0
    ) || 0;

  // Net Income Calculation
  const netIncome =
    incomeTransactions?.reduce((acc, tx) => acc + tx.amount, 0) || 0;

  // Total Fund Withdrawal Calculation
  const totalFundWithdrawal =
    userFundWithdrawal?.reduce(
      (acc, tx) => (tx.status === 1 ? acc + tx.amount : acc),
      0
    ) || 0;

  // Percentage calculations (starting from 100%)
  const withdrawalPercentage =
    totalInvestment > 0 ? (totalFundWithdrawal / totalInvestment) * 100 : 0;
  const incomePercentage =
    totalInvestment > 0 ? (netIncome / totalInvestment) * 100 : 0;
  const remainingPercentage = Math.max(
    100 - withdrawalPercentage - incomePercentage,
    0
  );

  return (
    <div className="card rounded-lg p-6 bg-white dark:!bg-gray-900 shadow-lg mt-6">
      <div className="card-header flex justify-between items-center mb-4">
        <h6 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Investment
        </h6>

        {/* Dropdown for Filter Selection */}
        <select
          className="form-select form-select-sm w-auto bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>Today</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>

      <div className="card-body text-center">
        <p className="text-gray-700 dark:text-gray-300 text-md flex justify-center items-center">
          Total Investment:{" "}
          <span className="font-semibold text-blue-500 ml-2">
            ${totalInvestment.toLocaleString()}
          </span>
        </p>

        {/* Investment Chart */}
        <div className="relative flex justify-center items-center mt-10">
          {/* Remaining Investment Percentage */}
          <div className="w-40 h-40 flex justify-center items-center rounded-full border-2 border-white bg-green-600 text-white relative z-10">
            <h5 className="text-lg font-semibold">{remainingPercentage.toFixed(1)}%</h5>
          </div>

          {/* Income Percentage */}
          <div className="w-36 h-36 flex justify-center items-center rounded-full border-2 border-white bg-blue-600 text-white absolute top-0 left-0 transform -translate-x-6 -translate-y-4">
            <h5 className="text-lg font-semibold">{incomePercentage.toFixed(1)}%</h5>
          </div>

          {/* Withdrawal Percentage */}
          <div className="w-36 h-36 flex justify-center items-center rounded-full border-2 border-white bg-red-600 text-white absolute top-0 right-0 transform translate-x-6 -translate-y-4">
            <h5 className="text-lg font-semibold">{withdrawalPercentage.toFixed(1)}%</h5>
          </div>
        </div>

        {/* Income Breakdown */}
        <div className="flex justify-between mt-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-600"></span>
              <span className="text-gray-600 dark:text-gray-300 text-sm">Remaining Investment</span>
            </div>
            <h6 className="text-green-500 font-semibold text-lg">
              {remainingPercentage.toFixed(1)}%
            </h6>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="text-gray-600 dark:text-gray-300 text-sm">Net Income</span>
            </div>
            <h6 className="text-blue-500 font-semibold text-lg">
              {incomePercentage.toFixed(1)}%
            </h6>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span className="text-gray-600 dark:text-gray-300 text-sm">Withdrawals</span>
            </div>
            <h6 className="text-red-500 font-semibold text-lg">
              {withdrawalPercentage.toFixed(1)}%
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investment;
