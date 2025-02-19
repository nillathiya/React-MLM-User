import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { FaSitemap } from "react-icons/fa";
import { Link } from "react-router-dom";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import Skeleton from "../../helper/Skeleton/Skeleton";
import "./incomeReports.css";

const StackSponsor = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        {
          id: "526534",
          user: "company (arbstake)",
          From: "( ARB513209 )",
          amount: "4.5",
          charges: "0.5",
          remark: "Receive direct income of amount 5 from (ARB513209) from level 1",
          date: "2025-02-06 15:25:07",
        },
        {
          id: "526535",
          user: "company (arbstake)",
          From: "( ARB016289 )",
          amount: "135",
          charges: "15",
          remark: "Receive direct income of amount 150 from (ARB016289) from level 1",
          date: "25 Jan 2024",
        },
        {
            id: "526535",
            user: "company (arbstake)",
            From: "( ARB143260 )",
            amount: "252",
            charges: "28",
            remark: "Receive direct income of amount 280 from (ARB143260) from level 1",
            date: "2025-02-06 16:25:08",
          },
          {
            id: "526535",
            user: "company (arbstake)",
            From: "( ARB945187 )",
            amount: "4.5",
            charges: "0.5",
            remark: "Receive direct income of amount 5 from (ARB945187) from level 1",
            date: "2025-02-06 18:00:36",
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
      <Breadcrumb title="Fund Transfer History"></Breadcrumb>
      <div className="daily_income mb-5">
        <div className="daily_total_income">
          <h6 className="text-white">Total Income</h6>
          <p className="text-white">396.0000</p>
        </div>
        <div className="daily_payable_income">
          <h6 className="text-white">Payable Income</h6>
          <p className="text-white">352.0000</p>
        </div>
      </div>
      <div className="card basic-data-table">
        <div className="card-body">
          <table
            className="table bordered-table mb-0"
            id="dataTable"
            data-page-length={10}
          >
            <thead>
              <tr>
                <th scope="col">S.L</th>
                <th scope="col">User</th>
                <th scope="col">From</th>
                <th scope="col">Amount ($)</th>
                <th scope="col">Charges ($)</th>
                <th scope="col">Remark</th>
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
                    <td>{user.user}</td>
                    <td>{user.From}</td>
                    <td>{user.amount}</td>
                    <td>{user.charges}</td>
                    <td>{user.remark}</td>
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

export default StackSponsor;
