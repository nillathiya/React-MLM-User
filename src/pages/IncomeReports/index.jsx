import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { Link, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import MasterLayout from "../../masterLayout/MasterLayout";
import Skeleton from "../../helper/Skeleton/Skeleton";
import { useSelector, useDispatch } from "react-redux";
import { getIncomeTransactionsByUserAsync } from "../../feature/transaction/transactionSlice.js";
import { formatDate } from "../../utils/dateUtils.js";
import { DEFAULT_PER_PAGE_ITEMS } from "../../constants/appConstants";
import { ICON } from "../../constants/icons";
import { Icon } from "@iconify/react";
import ExportToExcel from "../../components/common/ExportToExcel";

const IncomeReports = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source");
  const tableRef = useRef(null);

  const { incomeTransactions = [], incomeTransactionsLoading } = useSelector(
    (state) => state.transaction
  );
  const { companyInfo } = useSelector((state) => state.user);

  // Fetch transactions when source changes
  useEffect(() => {
    if (source) {
      dispatch(getIncomeTransactionsByUserAsync({ source }));
    }
  }, [source, dispatch]);

  // DataTable Initialization
  useEffect(() => {
    if (
      tableRef.current &&
      !incomeTransactionsLoading &&
      incomeTransactions.length > 0
    ) {
      setTimeout(() => {
        const $table = $(tableRef.current);
        if (!$.fn.DataTable.isDataTable(tableRef.current)) {
          $table.DataTable({
            pageLength: DEFAULT_PER_PAGE_ITEMS,
            responsive: true,
          });
        }
      }, 300);
    }
  }, [incomeTransactions, incomeTransactionsLoading]);

  // Filter transactions based on source
  const incomeTransactionFilterData = incomeTransactions.filter((tx) =>
    source ? tx.source === source : true
  );

  // Refresh transactions
  const handleRefresh = () => {
    dispatch(getIncomeTransactionsByUserAsync({ source }));
  };

  // Calculate total income and payable income
  const { totalIncome, totalPayableIncome } = incomeTransactions.reduce(
    (acc, { status, amount = 0, txCharge = 0 }) => {
      const totalAmount = amount + txCharge;
      if (status === 0) acc.totalPayableIncome += amount;
      else if (status === 1) acc.totalIncome += totalAmount;
      return acc;
    },
    { totalIncome: 0, totalPayableIncome: 0 }
  );

  return (
    <MasterLayout>
      <Breadcrumb title="Income Report" />

      <div className="p-3 sm:p-8 lg:p-8 !bg-white dark:!bg-gray-800 rounded-xl shadow-md">
        {/* Export Button */}
        <div className="flex justify-end mb-4">
          {/* Export Component */}
          <ExportToExcel
            data={incomeTransactionFilterData}
            fileName={`${source}_income_report`}
          />
        </div>

        {/* Income Summary Section */}
        <div className="!bg-gray-50 dark:!bg-gray-700 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Total Income */}
            <div className="flex items-center justify-between p-5 !bg-white dark:!bg-gray-900 rounded-lg shadow-md">
              <h6 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Total Income
              </h6>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {companyInfo.CURRENCY}
                {totalIncome}
              </p>
            </div>

            {/* Payable Income */}
            <div className="flex items-center justify-between p-5 !bg-white dark:!bg-gray-900 rounded-lg shadow-md">
              <h6 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Payable Income
              </h6>
              <p className="text-xl font-bold text-red-500 dark:text-red-400">
                {companyInfo.CURRENCY}
                {totalPayableIncome}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card basic-data-table mt-5">
        <div className="px-6 py-3 border-b-2 text-gray-600 flex justify-between items-center">
          <h5 className="card-title mb-0 capitalize">
            {`User ${source || ""} Income History`}
          </h5>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 
             bg-blue-600 text-white rounded-md 
             hover:bg-blue-700 transition active:scale-95
             dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
          >
            <Icon icon={ICON.REFRESH} className="w-7 h-7" />
          </button>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table
              ref={tableRef}
              className="table bordered-table mb-0"
              id="dataTable"
              data-page-length={DEFAULT_PER_PAGE_ITEMS}
            >
              <thead>
                <tr>
                  <th>S.L</th>
                  <th>User</th>
                  <th>Amount({companyInfo.CURRENCY})</th>
                  <th>Charge({companyInfo.CURRENCY})</th>
                  <th>Remark</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {incomeTransactionsLoading ? (
                  [...Array(5)].map((_, index) => (
                    <tr key={index}>
                      <td>
                        <Skeleton width="50px" height="20px" />
                      </td>
                      <td>
                        <Skeleton width="120px" height="20px" />
                      </td>
                      <td>
                        <Skeleton width="100px" height="20px" />
                      </td>
                      <td>
                        <Skeleton width="150px" height="20px" />
                      </td>
                      <td>
                        <Skeleton width="80px" height="20px" />
                      </td>
                      <td>
                        <Skeleton width="60px" height="20px" />
                      </td>
                      <td>
                        <Skeleton width="90px" height="20px" />
                      </td>
                    </tr>
                  ))
                ) : incomeTransactionFilterData.length > 0 ? (
                  incomeTransactionFilterData.map((data, index) => (
                    <tr key={data._id}>
                      <td>{index + 1}</td>
                      <td>
                        {data.uCode?.username || "N/A"}
                        {data.uCode?.name ? ` (${data.uCode.name})` : ""}
                      </td>

                      <td>
                        {companyInfo.CURRENCY}
                        {data.amount}
                      </td>
                      <td>
                        {companyInfo.CURRENCY}
                        {data.charge || 0}
                      </td>
                      <td>{data.remark}</td>
                      <td
                        className={`rounded-md font-semibold text-center
                        ${
                          data.status === 0
                            ? " !text-yellow-700"
                            : " !text-green-700"
                        }`}
                      >
                        {data.status === 0 ? "Pending" : "Confirmed"}
                      </td>
                      <td>{formatDate(data.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      {`No transactions found for ${source || "all sources"}`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default IncomeReports;
