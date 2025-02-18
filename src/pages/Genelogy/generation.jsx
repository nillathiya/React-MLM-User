import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { FaSitemap } from "react-icons/fa"; // Import the FaSitemap icon
import { Link } from "react-router-dom";
import MasterLayout from "../../masterLayout/MasterLayout";
import Skeleton from "../../helper/Skeleton/Skeleton";
import "./genology.css";

const Generation = () => {
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
          <h5 className="card-title mb-0">company ( arbstake )</h5>
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
                <th scope="col">Action</th>
                <th scope="col">Name</th>
                <th scope="col">UserName</th>
                <th scope="col">Join Date</th>
                <th scope="col">Status</th>
                <th scope="col">Level</th>
                <th scope="col">Sponsor ID(Name)</th>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MasterLayout>
  );
};

export default Generation;
