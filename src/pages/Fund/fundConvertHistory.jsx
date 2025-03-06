import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { Link } from "react-router-dom";
import MasterLayout from "../../masterLayout/MasterLayout";
import Skeleton from "../../helper/Skeleton/Skeleton";
import { useSelector } from "react-redux";
import {
  selectUserFundConvertHistory,
  selectTransactionLoading,
} from "../../feature/transaction/transactionSlice";
import { formatDate } from "../../utils/dateUtils.js";
import { DEFAULT_PER_PAGE_ITEMS } from "../../constants/appConstants";

const FundConvertHistory = () => {
  const userFundConvertHistory = useSelector(selectUserFundConvertHistory);
  const loading = useSelector(selectTransactionLoading);
  const tableRef = useRef(null);

  useEffect(() => {
    if (!loading && userFundConvertHistory.length > 0) {
      if ($.fn.DataTable.isDataTable("#dataTable")) {
        $("#dataTable").DataTable().destroy();
      }

      tableRef.current = $("#dataTable").DataTable({
        pageLength: DEFAULT_PER_PAGE_ITEMS,
        responsive: true,
      });
    }

    return () => {
      if (tableRef.current) {
        tableRef.current.destroy(true);
      }
    };
  }, [loading, userFundConvertHistory]);

  return (
    <MasterLayout>
      <div className="card basic-data-table">
        <div className="card-header">
          <h5 className="card-title mb-0">User Convert Fund History Table</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table bordered-table mb-0"
              id="dataTable"
              data-page-length={DEFAULT_PER_PAGE_ITEMS}
            >
              <thead>
                <tr>
                  <th scope="col">S.L</th>
                  <th scope="col">Tx User</th>
                  <th scope="col">Tx Type</th>
                  <th scope="col">Credit/Debit</th>
                  <th scope="col">Balance</th>
                  <th scope="col">Remark</th>
                  <th scope="col">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
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
                      </tr>
                    ))}
                  </>
                ) : userFundConvertHistory.length > 0 ? (
                  userFundConvertHistory.map((data, index) => (
                    <tr key={data._id}>
                      <td>{index + 1}</td>
                      <td>
                        <Link to="#" className="text-primary-600">
                          #{data.uCode?.username || "N/A"}
                        </Link>
                      </td>
                      <td>{data.txType || "N/A"}</td>
                      <td>{data.debitCredit || "N/A"}</td>
                      <td>{data.amount || "N/A"}</td>
                      <td>{data.remark || "N/A"}</td>
                      <td>{formatDate(data.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      User Conver Fund Transaction Not Found
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

export default FundConvertHistory;
