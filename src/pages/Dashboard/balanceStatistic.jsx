import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  DAYS_FILTER_OPTIONS,
  INCOME_FIELDS,
} from "../../constants/appConstants";
import { useSelector } from "react-redux";

const BalanceStatistic = () => {
  const { incomeTransactions } = useSelector((state) => state.transaction);
  const [filter, setFilter] = useState(DAYS_FILTER_OPTIONS[0]);

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

  const filteredTransactions = incomeTransactions?.filter((transaction) => {
    const createdAt = new Date(transaction.createdAt);

    if (filter === "today") return createdAt >= startOfToday;
    if (filter === "yesterday")
      return createdAt >= startOfYesterday && createdAt < startOfToday;
    if (filter === "currentWeek") return createdAt >= startOfCurrentWeek;
    if (filter === "lastWeek")
      return createdAt >= startOfLastWeek && createdAt <= endOfLastWeek;

    return true;
  });

  const incomeSummary = filteredTransactions?.reduce((acc, transaction) => {
    if (transaction.status === 1 && INCOME_FIELDS[transaction.source]) {
      acc[transaction.source] =
        (acc[transaction.source] || 0) + transaction.amount;
    }
    return acc;
  }, {});

  const chartLabels = Object.keys(incomeSummary || {}).map(
    (key) => INCOME_FIELDS[key]
  );
  const chartData = Object.values(incomeSummary || {});

  const incomeColors = ["#487FFF", "#FF9F29", "#28C76F", "#EA5455", "#9B51E0"];
  const incomeStatisticsOptions = {
    colors: incomeColors.slice(0, chartLabels.length),
    labels: chartLabels,
    legend: {
      show: true,
      position: "top",
      fontSize: "14px",
      markers: { radius: 4 },
    },
    chart: {
      type: "bar",
      height: 350,
      width: "100%",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    grid: {
      show: true,
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      padding: { left: 20, right: 20, top: 20, bottom: 20 },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "40%", // bar width
        distributed: true,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: "12px", fontWeight: "bold", colors: ["#6B7280"] },
      offsetY: -20, // amount position
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.7,
      },
      formatter: (val) => val.toLocaleString() + " $",
    },
    stroke: { show: true, width: 2, colors: ["#fff"] },
    tooltip: {
      theme: "dark",
      y: { formatter: (value) => "$" + value.toLocaleString() },
    },
    xaxis: {
      categories: chartLabels,
      labels: {
        style: { fontSize: "13px", fontWeight: "600", colors: "#6B7280" },
        rotate: -45,
        hideOverlappingLabels: false,
        maxHeight: 100,
        floating: true,
        trim: true,
      },
    },
    yaxis: {
      title: {
        text: "Income ($)",
        style: { fontSize: "14px", fontWeight: "bold" },
      },
      labels: {
        formatter: (value) => "$" + value.toLocaleString(),
        style: {
          fontSize: "12px",
        },
        offsetX: -10,
      },
      min: 0,
      max: Math.max(...chartData, 10) * 1.2,
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: { height: 300 },
          plotOptions: { bar: { columnWidth: "60%" } },
          xaxis: { labels: { style: { fontSize: "12px" } } },
          yaxis: { labels: { style: { fontSize: "12px" }, offsetX: -15 } },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: { height: 350 },
          plotOptions: { bar: { columnWidth: "65%" } },
          legend: { fontSize: "15px" },
          xaxis: { labels: { style: { fontSize: "12px" } } },
          yaxis: { labels: { style: { fontSize: "15px" }, offsetX: -20 } },
          dataLabels: {
            style: { fontSize: "15px" },
            offsetY: -20,
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: { height: 400 },
          plotOptions: { bar: { columnWidth: "75%" } },
          legend: { fontSize: "15px" },
          xaxis: { labels: { style: { fontSize: "12px" } } },
          yaxis: { labels: { style: { fontSize: "15px" }, offsetX: -25 } },
          dataLabels: {
            style: { fontSize: "15px" },
            offsetY: -20,
          },
        },
      },
    ],
  };

  return (
    <div className="col-12">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <h6 className="mb-2 fw-bold text-lg mb-0">Balance Statistic</h6>
            <select
              className="form-select form-select-sm w-auto bg-base border text-secondary-light capitalize"
              onChange={(e) => setFilter(e.target.value)}
            >
              {DAYS_FILTER_OPTIONS.map((data) => (
                <option key={data} className="capitalize">
                  {data}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-10 overflow-x-auto">
            <div className="w-full min-w-[400px] lg:min-w-[600px] xl:min-w-[800px]">
              {chartLabels.length > 0 ? (
                <ReactApexChart
                  options={incomeStatisticsOptions}
                  series={[{ name: "Income", data: chartData }]}
                  type="bar"
                  height={250}
                />
              ) : (
                <p className="text-center text-gray-500">
                  No income data available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceStatistic;
