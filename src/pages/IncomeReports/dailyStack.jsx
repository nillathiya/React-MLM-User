import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { FaSitemap } from "react-icons/fa";
import { Link } from "react-router-dom";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import Skeleton from "../../helper/Skeleton/Skeleton";
import "./incomeReports.css";

const DailyStack = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        {
          id: "526534",
          user: "Kathryn Murphy",
          amount: "8525272757",
          charges: "58000",
          remark: "ARB",
          date: "25 Jan 2024",
        },
        {
          id: "526535",
          user: "fvfvgfrd",
          amount: "89272277",
          charges: "5800dd0",
          remark: "ARB",
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
      <Breadcrumb title="Fund Transfer History"></Breadcrumb>
      <div className="daily_income mb-5">
        <div className="daily_total_income">
          <h6>Total Income</h6>
          <p>0</p>
        </div>
        <div className="daily_payable_income">
          <h6>Payable Income</h6>
          <p>0</p>
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

export default DailyStack;
