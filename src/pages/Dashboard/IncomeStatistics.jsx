import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  DAYS_FILTER_OPTIONS,
  INCOME_FIELDS,
} from "../../constants/appConstants";

const IncomeStatistics = () => {
  const { incomeTransactions } = useSelector((state) => state.transaction);
  const { companyInfo } = useSelector((state) => state.user);
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

  const incomeSummary = Object.keys(INCOME_FIELDS).reduce((acc, key) => {
    acc[key] = 0; // Initialize all income sources with zero
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

  const incomeData = Object.entries(incomeSummary).map(([key, value]) => ({
    key: INCOME_FIELDS[key],
    value: value, // Keep as number
  }));

  // Define colors for progress segments
  const progressColors = [
    "#06B6D4", // Cyan
    "#22C55E", // Green
    "#84CC16", // Lime
    "#EAB308", // Yellow
    "#F59E0B", // Orange
    "#F97316", // Dark Orange
  ];

  return (
    <div className="col-md-6">
      <div className="card radius-16">
        <div className="card-header">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <h6 className="mb-2 fw-bold text-lg mb-0">Income Report</h6>
            <select
              className="form-select form-select-sm w-auto bg-base border text-secondary-light"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {DAYS_FILTER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-body">
          {/* Dynamic Progress Bar */}
          <div className="mb-3 d-flex w-full overflow-hidden rounded-lg bg-gray-300">
            {incomeData.map((item, index) => {
              const widthPercentage = totalIncome
                ? (item.value / totalIncome) * 100
                : 0;
              return (
                <div
                  key={index}
                  className="h-3 transition-all"
                  style={{
                    width: `${widthPercentage}%`,
                    backgroundColor:
                      progressColors[index % progressColors.length],
                  }}
                />
              );
            })}
          </div>

          {/* Key-Value Data Display */}
          {incomeData.map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between p-12 bg-neutral-100"
            >
              <div className="d-flex align-items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      progressColors[index % progressColors.length],
                  }}
                />
                <span className="text-secondary-light">{item.key}</span>
                <span className="text-primary-light fw-semibold">
                  {companyInfo.CURRENCY}
                  {item.value.toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          {/* Total Income */}
          <div className="mt-3 text-primary-light fw-bold text-lg">
            Total Income: {companyInfo.CURRENCY}
            {totalIncome.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeStatistics;
