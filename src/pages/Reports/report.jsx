import React, { useEffect, useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import ExportToExcel from "../../components/common/ExportToExcel";
import {
  DAYS_FILTER_OPTIONS,
  INCOME_FIELDS,
} from "../../constants/appConstants";
import { useSelector } from "react-redux";
import { getIncomeTransactionsByUserAsync } from "../../feature/transaction/transactionSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Skeleton from "../../helper/Skeleton/Skeleton";

const Report = () => {
  const dispatch = useDispatch();
  const { incomeTransactions, incomeTransactionsLoading } = useSelector(
    (state) => state.transaction
  );
  const { currentUser } = useSelector((state) => state.auth);
  const { companyInfo } = useSelector((state) => state.user);
  const [filter, setFilter] = useState("overall");

  useEffect(() => {
    const fetchUserIncomeTransaction = async () => {
      try {
        await dispatch(getIncomeTransactionsByUserAsync({})).unwrap();
      } catch (error) {
        toast.error(error || "Server Error,Please try later");
      }
    };
    fetchUserIncomeTransaction();
  }, []);

  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const startOfCurrentWeek = new Date(today);
  startOfCurrentWeek.setDate(today.getDate() - today.getDay());

  const startOfLastWeek = new Date(startOfCurrentWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  const endOfLastWeek = new Date(startOfCurrentWeek);
  endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);

  const filteredTransactions = incomeTransactions.filter((transaction) => {
    const createdAt = new Date(transaction.createdAt);

    if (filter === "today") return createdAt >= startOfToday;
    if (filter === "yesterday")
      return createdAt >= startOfYesterday && createdAt < startOfToday;
    if (filter === "currentWeek") return createdAt >= startOfCurrentWeek;
    if (filter === "lastWeek")
      return createdAt >= startOfLastWeek && createdAt <= endOfLastWeek;

    return true;
  });

  const incomeSummary = Object.keys(INCOME_FIELDS).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  filteredTransactions.forEach((transaction) => {
    if (transaction.status === 1 && INCOME_FIELDS[transaction.source]) {
      incomeSummary[transaction.source] += transaction.amount;
    }
  });

  const totalIncome = Object.values(incomeSummary).reduce(
    (acc, value) => acc + value,
    0
  );

  const incomeData = [
    ...Object.entries(incomeSummary).map(([key, value]) => ({
      key: INCOME_FIELDS[key],
      value: `${companyInfo.CURRENCY}${value.toFixed(2)}`,
    })),
    {
      key: "Total Income",
      value: `${companyInfo.CURRENCY}${totalIncome.toFixed(2)}`,
    },
  ];

  // Skeleton loading component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {/* User Info Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 !mb-6">
        <Skeleton className="!h-20 !w-full !rounded-lg" />
        <Skeleton className="!h-20 !w-full !rounded-lg" />
      </div>

      {/* Export Button Skeleton */}
      <div className="flex justify-end !mb-6">
        <Skeleton className="!h-10 !w-32 !rounded-lg" />
      </div>

      {/* Income Data Skeleton */}
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} className="!h-20 !w-full !rounded-lg" />
      ))}
    </div>
  );

  return (
    <MasterLayout>
      <Breadcrumb title="Income Report" />
      <div className="!px-3">
        <div className="min-h-screen !p-6 !text-gray-900 dark:!bg-darkSecondary dark:!text-white !bg-gray-200 transition-all !shadow-md">
          <div className="max-w-4xl mx-auto">
            {/* Heading */}
            <h5 className="heading">Total Income Report</h5>

            {/* Filter Options */}
            <div className="flex justify-center gap-2 !mb-6 flex-wrap">
              {DAYS_FILTER_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  className={`!px-4 !py-2 rounded-lg transition-all text-sm font-medium border dark:!border-gray-600 ${
                    filter === option
                      ? "!bg-blue-600 !text-white"
                      : "!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-gray-300 hover:!bg-gray-200 dark:!hover:bg-gray-700"
                  }`}
                  disabled={incomeTransactionsLoading}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>

            {incomeTransactionsLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                {/* User Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 !mb-6">
                  <div className="!bg-white dark:!bg-gray-800 !p-4 rounded-lg !shadow-md text-center">
                    <p className="font-semibold">
                      User: {currentUser?.username || ""}
                    </p>
                  </div>
                  <div className="!bg-white dark:!bg-gray-800 !p-4 rounded-lg !shadow-md text-center">
                    <p className="font-semibold">
                      Total Income: {companyInfo.CURRENCY}
                      {totalIncome.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Export Button */}
                <div className="flex justify-end !mb-6">
                  <ExportToExcel
                    data={incomeData}
                    fileName={`${filter}_income_report`}
                  />
                </div>

                {/* Key-Value Data Display */}
                <div className="space-y-4">
                  {incomeData.map((item, index) => (
                    <div
                      key={index}
                      className={`!p-4 !bg-white dark:!bg-gray-800 !rounded-lg !shadow-md border !border-gray-300 dark:!border-gray-700 ${
                        item.key === "Total Income"
                          ? "!bg-blue-500 !text-white"
                          : ""
                      }`}
                    >
                      <p className="text-sm font-semibold !text-gray-700 dark:!text-gray-300">
                        {item.key}
                      </p>
                      <p className="text-lg font-bold !text-gray-900 dark:!text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default Report;
