import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { FaSitemap } from "react-icons/fa";
import { Link } from "react-router-dom";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import Skeleton from "../../helper/Skeleton/Skeleton.jsx";
import "./fund.css";

const FundConvertHistory = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        {
          id: "526534",
          name: "Credit",
          date: "25 Jan 2024",
          mobile: "7849025269",
          status: "Active",
          package: "25 Jan 2024 00:12",
        },
        {
          id: "696589",
          name: "Debit",
          date: "25 Jan 2024",
          mobile: "7894561236",
          status: "Active",
          package: "25 Jan 2024 00:12",
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
      <div className="card basic-data-table">
        <div className="card-header">
          <h5 className="card-title mb-0">Default Data Tables</h5>
        </div>
        <div className="card-body">
          <table
            className="table bordered-table mb-0"
            id="dataTable"
            data-page-length={10}
          >
            <thead>
              <tr>
                <th scope="col">S.L</th>
                <th scope="col">Tx user</th>
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
              ) : (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to="#" className="text-primary-600">
                        #{user.id}
                      </Link>
                    </td>
                    <td>{user.date}</td>
                    <td>{user.name}</td>
                    <td>{user.mobile}</td>
                    <td>
                      <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                        {user.status}
                      </span>
                    </td>
                    <td>{user.package}</td>
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

export default FundConvertHistory;
