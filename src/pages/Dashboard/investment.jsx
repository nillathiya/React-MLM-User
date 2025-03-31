import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { selectUserFundWithdrwalHistory } from "../../feature/transaction/transactionSlice";

const Investment = () => {
  const { userOrders = [], loading: ordersLoading } = useSelector(
    (state) => state.orders
  );
  const { companyInfo } = useSelector((state) => state.user);
  const {
    incomeTransactions = [],
    incomeTransactionsLoading,
    loading: transactionLoading,
  } = useSelector((state) => state.transaction);

  const userFundWithdrwalHistory =
    useSelector(selectUserFundWithdrwalHistory) || [];

  const [filter, setFilter] = useState("Today");

  // Loading check
  const isLoading =
    ordersLoading || transactionLoading || incomeTransactionsLoading;
  const filterOrders = (orders, range) => {
    const now = dayjs();
    return orders?.filter((order) => {
      const orderDate = dayjs(order.createdAt);
      switch (range) {
        case "Today":
          return orderDate.isSame(now, "day");
        case "Weekly":
          return orderDate.isAfter(dayjs().subtract(7, "day"));
        case "Monthly":
          return orderDate.isAfter(dayjs().subtract(1, "month"));
        case "Yearly":
          return orderDate.isAfter(dayjs().subtract(1, "year"));
        default:
          return true;
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></span>
      </div>
    );
  }

  const totalInvestment = Array.isArray(userOrders)
    ? filterOrders(userOrders, filter)?.reduce(
        (acc, order) => acc + (order.amount || 0),
        0
      )
    : 0;

  const netIncome =
    incomeTransactions?.reduce((acc, tx) => acc + tx.amount, 0) || 0;

  const totalFundWithdrawal = parseFloat(
    userFundWithdrwalHistory
      .reduce((acc, { status, amount, txCharge, wPool }) => {
        const totalAmount = (amount ?? 0) + (txCharge ?? 0) + (wPool ?? 0);
        if (status === 1) acc += totalAmount;
        return acc;
      }, 0)
      .toFixed(2)
  );

  const totalActivity = totalInvestment + netIncome + totalFundWithdrawal;

  const investmentPercentage =
    totalActivity > 0 ? (totalInvestment / totalActivity) * 100 : 0;
  const incomePercentage =
    totalActivity > 0 ? (netIncome / totalActivity) * 100 : 0;
  const withdrawalPercentage =
    totalActivity > 0 ? (totalFundWithdrawal / totalActivity) * 100 : 0;

  const baseSize = 160;
  const minSize = 50;

  let remainingSizeRaw = (investmentPercentage / 100) * baseSize;
  let incomeSizeRaw = (incomePercentage / 100) * baseSize;
  let withdrawalSizeRaw = (withdrawalPercentage / 100) * baseSize;

  let totalRawSize = remainingSizeRaw + incomeSizeRaw + withdrawalSizeRaw;
  if (totalRawSize > baseSize) {
    let scaleFactor = baseSize / totalRawSize;
    remainingSizeRaw *= scaleFactor;
    incomeSizeRaw *= scaleFactor;
    withdrawalSizeRaw *= scaleFactor;
  }

  let remainingSize = Math.max(remainingSizeRaw, minSize);
  let incomeSize = Math.max(incomeSizeRaw, minSize);
  let withdrawalSize = Math.max(withdrawalSizeRaw, minSize);

  let adjustedTotalSize = remainingSize + incomeSize + withdrawalSize;
  if (adjustedTotalSize > baseSize) {
    let excess = adjustedTotalSize - baseSize;
    let reduceFactor = excess / 3;

    remainingSize = Math.max(remainingSize - reduceFactor, minSize);
    incomeSize = Math.max(incomeSize - reduceFactor, minSize);
    withdrawalSize = Math.max(withdrawalSize - reduceFactor, minSize);
  }

  return (
    <div className="card radius-16 !rounded-lg bg-white dark:!bg-gray-900 shadow-lg mt-6">
      <div className="card-header flex justify-between items-center mb-4 ">
        <h6 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Investment
        </h6>
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
            {companyInfo.CURRENCY}
            {totalInvestment.toLocaleString()}
          </span>
        </p>
        <div className="relative flex justify-center items-center mt-10 w-full max-w-[500px] h-[220px] mx-auto">
          <div
            className="flex justify-center items-center rounded-full border-2 
             !bg-green-500 dark:!bg-green-700 
             !border-black dark:!border-white 
             !text-black dark:!text-white 
             shadow-lg"
            style={{
              width: `${remainingSize}px`,
              height: `${remainingSize}px`,
            }}
          >
            <h5
              className={`font-semibold leading-none ${
                remainingSize < 70 ? "text-xs" : "text-lg"
              }`}
            >
              {investmentPercentage.toFixed(1)}%
            </h5>
          </div>

          <div
            className="absolute flex justify-center items-center rounded-full border-2 
             bg-blue-600 dark:bg-blue-700 
             border-white dark:border-gray-400 
             text-white shadow-md"
            style={{
              width: `${incomeSize}px`,
              height: `${incomeSize}px`,
              left: "10%",
              top: "10%",
            }}
          >
            <h5
              className={`font-semibold leading-none ${
                incomeSize < 70 ? "text-xs" : "text-lg"
              }`}
            >
              {incomePercentage.toFixed(1)}%
            </h5>
          </div>
          <div
            className="absolute flex justify-center items-center rounded-full border-2 
             bg-red-600 dark:bg-red-700 
             border-white dark:border-gray-400 
             text-white shadow-md"
            style={{
              width: `${withdrawalSize}px`,
              height: `${withdrawalSize}px`,
              right: "10%",
              bottom: "10%",
            }}
          >
            <h5
              className={`font-semibold leading-none ${
                withdrawalSize < 70 ? "text-xs" : "text-lg"
              }`}
            >
              {withdrawalPercentage.toFixed(1)}%
            </h5>
          </div>
        </div>
        {/* Income Breakdown */}
        <div className="flex justify-between mt-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-600"></span>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                Investment
              </span>
            </div>
            <h6 className="text-green-500 font-semibold text-lg">
              {totalInvestment}
            </h6>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                Net Income
              </span>
            </div>
            <h6 className="text-blue-500 font-semibold text-lg">{netIncome}</h6>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                Withdrawals
              </span>
            </div>
            <h6 className="text-red-500 font-semibold text-lg">
              {totalFundWithdrawal}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investment;
