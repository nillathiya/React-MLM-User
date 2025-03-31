import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import MasterLayout from "../../masterLayout/MasterLayout";
import Skeleton from "../../helper/Skeleton/Skeleton";
import { useSelector } from "react-redux";
import {
  selectUserFundWithdrwalHistory,
  selectTransactionLoading,
} from "../../feature/transaction/transactionSlice.js";
import { fetchUserFundWithdrawalHistoryAsync } from "../../feature/withdrawal/withdrawalSlice.js";
import { formatDate } from "../../utils/dateUtils.js";
import { DEFAULT_PER_PAGE_ITEMS } from "../../constants/appConstants";
import { ICON } from "../../constants/icons";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDispatch } from "react-redux";
import ExportToExcel from "../../components/common/ExportToExcel/index.jsx";
import { FUND_TX_TYPE } from "../../utils/constatnt/transactionType.js";

const WithdrawalReports = () => {
  const dispatch = useDispatch();
  const { loading: fetchUserFundWithdrawalHistoryLoading } = useSelector(
    (state) => state.withdrawal
  );
  const { companyInfo } = useSelector((state) => state.user);
  const userFundWithdrwalHistory = useSelector(selectUserFundWithdrwalHistory);
  const loading = useSelector(selectTransactionLoading);
  const tableRef = useRef(null);
  useEffect(() => {
    if (
      tableRef.current &&
      !loading &&
      !fetchUserFundWithdrawalHistoryLoading &&
      userFundWithdrwalHistory.length > 0
    ) {
      setTimeout(() => {
        const $table = $(tableRef.current);

        // Check if DataTable is already initialized
        if (!$.fn.DataTable.isDataTable(tableRef.current)) {
          // Initialize DataTable only if it hasn't been initialized yet
          $table.DataTable({
            pageLength: DEFAULT_PER_PAGE_ITEMS,
            responsive: true,
          });
        }
      }, 300);
    }
  }, [
    userFundWithdrwalHistory,
    loading,
    fetchUserFundWithdrawalHistoryLoading,
  ]);

  const handleRefresh = () => {
    dispatch(
      fetchUserFundWithdrawalHistoryAsync({
        txType: FUND_TX_TYPE.FUND_WITHDRAWAL,
      })
    );
  };

  const { userTotalWithdrawal, userPendingWithdrawal, userRejectedWithdrawal } =
    userFundWithdrwalHistory.reduce(
      (acc, { status, amount, txCharge, wPool }) => {
        const totalAmount = (amount ?? 0) + (txCharge ?? 0) + (wPool ?? 0);
        if (status === 0) acc.userPendingWithdrawal += totalAmount;
        else if (status === 2) acc.userRejectedWithdrawal += totalAmount;
        else if (status === 1) acc.userTotalWithdrawal += totalAmount;
        return acc;
      },
      {
        userTotalWithdrawal: 0,
        userPendingWithdrawal: 0,
        userRejectedWithdrawal: 0,
      }
    );

  // Format values properly
  const formattedUserTotalWithdrawal = parseFloat(
    userTotalWithdrawal.toFixed(2)
  );
  const formattedUserPendingWithdrawal = parseFloat(
    userPendingWithdrawal.toFixed(2)
  );
  const formattedUserRejectedWithdrawal = parseFloat(
    userRejectedWithdrawal.toFixed(2)
  );

  return (
    <MasterLayout>
      <Breadcrumb title="Withdrawal-report"></Breadcrumb>
      <div className="radius-16 mt-5 withdrawal_report  w-full max-w-lg !px-4 py-3 !bg-white dark:!bg-darkCard shadow-lg rounded-lg">
        <div className=" p-0">
          <div className="p-20">
            <ExportToExcel />
            <div className=" withdrwal_detail mt-3 position-relative z-1 py-32 text-center px-3 w-full max-w-lg !px-4 py-3 !bg-white dark:!bg-darkCard shadow-lg rounded-lg">
              <div className="d-flex justify-content-between">
                <h6 className=" p-3">Total Withdrawal</h6>
                <p className=" p-3">
                  {companyInfo.CURRENCY}
                  {formattedUserTotalWithdrawal}
                </p>
              </div>
              <hr className="" />
              <div className="d-flex justify-content-between">
                <h6 className=" p-3">Pending Withdrawal</h6>
                <p className=" p-3">
                  {companyInfo.CURRENCY}
                  {formattedUserPendingWithdrawal}
                </p>
              </div>
              <hr className="" />
              <div className="d-flex justify-content-between">
                <h6 className=" p-3">Reject Withdrawal</h6>
                <p className=" p-3">
                  {companyInfo.CURRENCY}
                  {formattedUserRejectedWithdrawal}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card basic-data-table mt-5">
        <div className="px-6 py-3 border-b-2 text-gray-600 flex justify-between items-center">
          <h5 className="card-title mb-0 " style={{ marginLeft: "20px" }}>
            User Fund Withdrawal History Table
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
                  <th scope="col">S.L</th>
                  <th scope="col">Amount ({companyInfo.CURRENCY})</th>
                  <th scope="col">Charges ({companyInfo.CURRENCY})</th>
                  <th scope="col">Withdrawal Pool ({companyInfo.CURRENCY})</th>
                  <th scope="col">Payable Amount ({companyInfo.CURRENCY})</th>
                  <th scope="col">Status</th>
                  <th scope="col">Reason</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading || fetchUserFundWithdrawalHistoryLoading ? (
                  <>
                    {[...Array(5)].map((_, index) => (
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
                        <td>
                          <Skeleton width="90px" height="20px" />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : userFundWithdrwalHistory.length > 0 ? (
                  userFundWithdrwalHistory.map((data, index) => (
                    <tr key={data._id}>
                      <td>{index + 1}</td>
                      <td>
                        {companyInfo.CURRENCY}
                        {(
                          data.amount ??
                          0 + data.txCharge ??
                          0 + data.wPool ??
                          0
                        ).toFixed(2)}
                      </td>
                      <td>
                        {companyInfo.CURRENCY}
                        {data.txCharge}
                      </td>
                      <td>
                        {companyInfo.CURRENCY}
                        {data.wPool}
                      </td>
                      <td>
                        {companyInfo.CURRENCY}
                        {data.amount}
                      </td>
                      <td
                        className={`status-cell ${
                          data.status === 0
                            ? "pending"
                            : data.status === 1
                            ? "success"
                            : "rejected"
                        }`}
                      >
                        {data.status === 0
                          ? "Pending"
                          : data.status === 1
                          ? "Success"
                          : "Rejected"}
                      </td>
                      <td>{data.reason || "N/A"}</td>
                      <td>{formatDate(data.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      User Fund Withdrawal Transaction Not Found
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

export default WithdrawalReports;
