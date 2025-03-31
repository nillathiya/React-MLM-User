import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateUtils";

const NewCustomerList = () => {
  const { incomeTransactions } = useSelector((state) => state.transaction);
  const { companyInfo } = useSelector((state) => state.user);

  // Sort by createdAt in descending order and take the last 5 (most recent)
  const selectTopFiveIncomeTransactions = Array.isArray(incomeTransactions)
    ? [...incomeTransactions] 
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
        .slice(0, 5)
    : [];

  return (
    <div className="card radius-16 mt-24">
      <div className="card-header">
        <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
          <h6 className="mb-2 fw-bold text-lg mb-0">Income List</h6>
          {/* Uncomment if you want to add the View All link back */}
          {/* <Link
            to="#"
            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
          >
            View All
            <iconify-icon
              icon="solar:alt-arrow-right-linear"
              className="icon"
            />
          </Link> */}
        </div>
      </div>
      <div className="card-body">
        {selectTopFiveIncomeTransactions.length > 0 ? (
          <div className="table-responsive scroll-sm">
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th scope="col" className="text-center">
                    Income Type
                  </th>
                  <th scope="col" className="text-center">
                    Income Amount
                  </th>
                  <th scope="col" className="text-center">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectTopFiveIncomeTransactions.map((tx) => (
                  <tr key={tx._id}>
                    <td className="text-center capitalize">{tx.source}</td>
                    <td className="text-center">
                      {companyInfo?.CURRENCY || "$"}
                      {tx.amount}
                    </td>
                    <td className="text-center">{formatDate(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400 text-md fw-medium">
              No income transactions found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewCustomerList;