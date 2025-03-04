import React, { useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import ExportToExcel from "../../components/common/ExportToExcel";
import {
  DAYS_FILTER_OPTIONS,
  INCOME_FIELDS,
} from "../../constants/appConstants";
import { useSelector } from "react-redux";

const Report = () => {
  const { incomeTransactions } = useSelector((state) => state.transaction);
  const { currentUser } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState("overall");

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

  const incomeSummary = filteredTransactions.reduce((acc, transaction) => {
    if (transaction.status === 1 && INCOME_FIELDS[transaction.source]) {
      acc[transaction.source] =
        (acc[transaction.source] || 0) + transaction.amount;
    }
    return acc;
  }, {});

  const totalIncome = Object.values(incomeSummary).reduce(
    (acc, value) => acc + value,
    0
  );

  const incomeData = [
    ...Object.entries(incomeSummary).map(([key, value]) => ({
      key: INCOME_FIELDS[key],
      value: `$${value.toFixed(2)}`,
    })),
    {
      key: "Total Income",
      value: `$${totalIncome.toFixed(2)}`,
    },
  ];

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
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 !mb-6">
              <div className="!bg-white dark:!bg-gray-800 !p-4 rounded-lg !shadow-md text-center">
                <p className="font-semibold">
                  User: {currentUser?.username || ""}
                </p>
              </div>
              <div className="!bg-white dark:!bg-gray-800 !p-4 rounded-lg !shadow-md text-center">
                <p className="font-semibold">
                  Total Income: ${totalIncome.toFixed(2)}
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
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}

export default Report
