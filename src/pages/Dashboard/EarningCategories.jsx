import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CAPPINGMULTIPLIER } from "../../constants/appConstants";

const EarningCategories = () => {
  const { isUserRemainigCappingLoading, userRemainingCapping = null } =
    useSelector((state) => state.user);
  const { userOrders = [], loading: userOrdersLoading } = useSelector(
    (state) => state.orders
  );

  const totalPackageAmount = userOrders.reduce((acc, order) => {
    if (order.status === 1) acc += order.amount;
    return acc;
  }, 0);
  const userTotalCapping =
    Number(totalPackageAmount) * Number(CAPPINGMULTIPLIER);

  const cappingProgress =
    userRemainingCapping && userTotalCapping
      ? Math.min((userRemainingCapping / userTotalCapping) * 100, 100)
      : 0;

  // Format numbers for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="space-y-6 animate-pulse">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 !p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-1/3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"></div>
            <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="col-md-6">
      <div className="card radius-16 h-100">
        <div className="card-header">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <h6 className="mb-2 fw-bold text-lg">Capping Overview</h6>
          </div>
        </div>
        <div className="card-body">
          {isUserRemainigCappingLoading || userOrdersLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="space-y-6">
              {/* Total Capping */}
              <div className="flex items-center justify-between gap-4 !p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                      Total Capping
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(userTotalCapping)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  100%
                </span>
              </div>

              {/* Remaining Capping */}
              <div className="flex items-center justify-between gap-4 !p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                      Remaining Capping
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(userRemainingCapping)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-1/3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-green-500 dark:bg-green-400 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${cappingProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {Math.round(cappingProgress)}%
                  </span>
                </div>
              </div>

              {/* Total Package Amount */}
              <div className="flex items-center justify-between gap-4 !p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                      Total Package Amount
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(totalPackageAmount)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Base
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningCategories;
