import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { FaSitemap } from "react-icons/fa";
import { Link } from "react-router-dom";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import Skeleton from "../../helper/Skeleton/Skeleton";
import "./fund.css";

const FundTranseferHistory = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        {
          id: "526534",
          name: "Kathryn Murphy",
          date: "25 Jan 2024",
          status: "Active",
          label: "Level2",
          sponcer: "ARB513209 ()",
        },
        {
          id: "696589",
          name: "Annette Black",
          date: "25 Jan 2024",
          status: "Active",
          label: "Level3",
          sponcer: "ARB543690 ()",
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
        responsive: true, // Ensures responsive behavior
      });
      return () => {
        table.destroy(true);
      };
    }
  }, [loading]);
  return (
    <MasterLayout>
      <Breadcrumb title="Fund Transfer History" />
      <div className="card basic-data-table">
        <div className="card-header">
          <h5 className="card-title mb-0">Company (Arbstake)</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table bordered-table mb-0" id="dataTable">
              <thead>
                <tr>
                  <th scope="col">S.L</th>
                  <th scope="col">Tx user</th>
                  <th scope="col">Tx Type</th>
                  <th scope="col">Credit/Debit</th>
                  <th scope="col">Balance</th>
                  <th scope="col">Remark</th>
                  <th scope="col">Date&Time</th>
                  <th scope="col">Sponsor ID(Name)</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [...Array(5)].map((_, index) => (
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
                    ))
                  : users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>
                          <a href="#" className="text-primary-600">
                            <FaSitemap />
                          </a>
                        </td>
                        <td>{user.name}</td>
                        <td>
                          <Link to="#" className="text-primary-600">
                            #{user.id}
                          </Link>
                        </td>
                        <td>{user.date}</td>
                        <td>
                          <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                            {user.status}
                          </span>
                        </td>
                        <td>{user.sponcer}</td>
                        <td>{user.label}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default FundTranseferHistory;
