import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { Link } from "react-router-dom";
import MasterLayout from "../../masterLayout/MasterLayout";
import Skeleton from "../../helper/Skeleton/Skeleton";
import "./genology.css";
import { useSelector, useDispatch } from "react-redux";
import { getUserDirectsAsync } from "../../feature/user/userSlice";
import toast from "react-hot-toast";
import { DEFAULT_PER_PAGE_ITEMS } from "../../constants/appConstants";
import { formatDate } from "../../utils/dateUtils.js";

const Direct = () => {
  const dispatch = useDispatch();
  const { userDirects, isLoading } = useSelector((state) => state.user);
  const tableRef = useRef(null);

  useEffect(() => {
    if (userDirects.length === 0) {
      dispatch(getUserDirectsAsync()).catch((error) => {
        toast.error(error || "Server error");
      });
    }
  }, [userDirects.length, dispatch]);

  useEffect(() => {
    if (tableRef.current && !isLoading && userDirects.length > 0) {
      const $table = $(tableRef.current);
      if (!$.fn.DataTable.isDataTable($table)) {
        $table.DataTable({
          pageLength: DEFAULT_PER_PAGE_ITEMS,
          responsive: true,
        });
      }
    }
  }, [userDirects, isLoading]);

  return (
    <MasterLayout>
      <div className="card basic-data-table">
        <div className="card-header">
          <h5 className="card-title mb-0">User Directs</h5>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table
              ref={tableRef}
              className="table bordered-table mb-0"
              id="dataTable"
              data-page-length={DEFAULT_PER_PAGE_ITEMS}
            >
              <thead>
                <tr>
                  <th scope="col">S.L</th>
                  <th scope="col">UserName</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Package</th>
                  <th scope="col">Status</th>
                  <th scope="col">Join Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <>
                    {[...Array(10)].map((_, index) => (
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
                ) : userDirects.length > 0 ? (
                  userDirects.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>
                        <Link to="#" className="text-primary-600">
                          {user.username
                            ? `${user.username} ${
                                user.name ? `(${user.name})` : ""
                              }`
                            : "N/A"}
                        </Link>
                      </td>

                      <td>{user.mobile || "N/A"}</td>
                      <td>{user.package}</td>
                      <td
                        className={`rounded-md font-semibold text-center px-3 py-1
    ${user.activeStatus === 1 ? "!text-green-700" : "!text-yellow-700"}`}
                      >
                        {user.activeStatus === 1 ? "Active" : "Not Active"}
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      User Directs Not Found
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

export default Direct;
