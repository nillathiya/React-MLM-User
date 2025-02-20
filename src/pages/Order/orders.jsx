import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import Skeleton from "../../helper/Skeleton/Skeleton";
import "./orders.css";

const Orders = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        {
          id: "526534",
          amount: "8525272757",
          date: "25 Jan 2024",
          status: "Active",
        },
        {
          id: "526535",
          amount: "89272277",
          user: "fvfvgfrd",
          date: "26 Jan 2024",
          status: "Active",
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
      <div className="Total_ammount mb-5">
        <div className="daily_total_income">
          <h6 className="text-white">Total Package Amount</h6>
          <p className="text-white">0</p>
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
                <th scope="col">Package amount</th>
                <th scope="col">Package Date</th>
                <th scope="col">Package Status</th>
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
                    </tr>
                  ))}
                </>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.amount}</td>
                    <td>{user.date}</td>
                    <td>{user.status}</td>
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

export default Orders;
