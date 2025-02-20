import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import Skeleton from "../../helper/Skeleton/Skeleton";

const WithdrawalReports = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        {
          amount: "8525272757",
          tds: "Kathryn Murphy",
          acharges:"485000",
          pammount: "58000",
          status:"active",
          reason: "ARB",
          date: "25 Jan 2024",
        },
        {
          amount: "89272277",
          tds: "fvfvgfrd",
          acharges:"48500",
          pammount: "58009990",
          status:"active",
          reason: "ARB",
          date: "25 Jan 2024",
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!loading) {
      const table = $("#dataTable").DataTable({
        destroy: true,
        pageLength: 10,
        responsive: true,
      });
      return () => {
        table.destroy(true);
      };
    }
  }, [loading]);
  return (
    <MasterLayout>
      <Breadcrumb title="Withdrawal-report"></Breadcrumb>
      <div className="radius-16 mt-5 withdrawal_report">
        <div className=" p-0">
          <div className="p-20">
            <button className="export_btn">Export to Excel</button>
            <div className="position-relative z-1 py-32 text-center px-3 withdrwal_detail">
              <div className="d-flex justify-content-between">
                <h6 className=" p-3">Total Withdrawal</h6>
                <p className=" p-3">$ 0</p>
              </div>
              <hr className="" />
              <div className="d-flex justify-content-between">
                <h6 className=" p-3">Paid Withdrawal</h6>
                <p className=" p-3">$ 0</p>
              </div>
              <hr className="" />
              <div className="d-flex justify-content-between">
                <h6 className=" p-3">Reject Withdrawal</h6>
                <p className=" p-3">$ 0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card basic-data-table mt-5">
        <div className="card-body">
          <table
            className="table bordered-table mb-0"
            id="dataTable"
            data-page-length={10}
          >
            <thead>
              <tr>
                <th scope="col">S.L</th>
                <th scope="col">Amount ($)</th>
                <th scope="col">TDS(5%)</th>
                <th scope="col">Admin charges @ ($)</th>
                <th scope="col">Payable Amount ($)</th>
                <th scope="col">Status</th>
                <th scope="col">Reason</th>
                <th scope="col">Date</th>
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
                      <td>
                        <Skeleton width="90px" height="20px" />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.amount}</td>
                    <td>{user.tds}</td>
                    <td>{user.acharges}</td>
                    <td>{user.pammount}</td>
                    <td>{user.status}</td>
                    <td>{user.reason}</td>
                    <td>{user.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MasterLayout>
  );
};

export default WithdrawalReports;
