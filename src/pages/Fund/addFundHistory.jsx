import React, { useEffect } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { Link } from "react-router-dom";
import MasterLayout from "../../masterLayout/MasterLayout";
import Skeleton from "../../helper/Skeleton/Skeleton";
import { useSelector } from "react-redux";
import {
  selectAddFundHistory,
  selectTransactionLoading,
} from "../../feature/transaction/transactionSlice";
import { formatDate } from "../../utils/dateUtils.js";

const AddFundHistory = () => {
  const addFundHistory = useSelector(selectAddFundHistory);
  const {companyInfo}=useSelector((state) => state.user);
  const loading = useSelector(selectTransactionLoading);

  useEffect(() => {
    if (!loading && addFundHistory.length > 0) {
      const table = $("#dataTable").DataTable({
        destroy: true,
        pageLength: 10,
        responsive: true,
      });

      return () => {
        table.destroy(true);
      };
    }
  }, [loading, addFundHistory]);

  return (
    <MasterLayout>
      <div className="card basic-data-table">
        <div className="card-header">
          <h5 className="card-title mb-0">Add Fund History Table</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table bordered-table mb-0"
              id="dataTable"
              data-page-length={10}
            >
              <thead>
                <tr>
                  <th scope="col">S.L</th>
                  <th scope="col">Tx User</th>
                  <th scope="col">Tx Type</th>
                  <th scope="col">Credit/Debit</th>
                  <th scope="col">Balance</th>
                  <th scope="col">Remark</th>
                  <th scope="col">Date&Time</th>
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
                ) : addFundHistory.length > 0 ? (
                  addFundHistory.map((data, index) => (
                    <tr key={data._id}>
                      <td>{index + 1}</td>
                      <td>
                        <Link to="#" className="text-primary-600">
                          #{data.uCode?.username || "N/A"}
                        </Link>
                      </td>
                      <td>{data.txType || "N/A"}</td>
                      <td>{data.debitCredit || "N/A"}</td>
                      <td>{companyInfo.CURRENCY}{data.amount || "N/A"}</td>
                      <td>{data.remark || "N/A"}</td>
                      <td>{formatDate(data.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No Add Transaction Found
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

export default AddFundHistory;
