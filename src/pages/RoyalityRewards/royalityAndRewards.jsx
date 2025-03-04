import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import Breadcrumb from "../../components/Breadcrumb";
import MasterLayout from "../../masterLayout/MasterLayout";
import Skeleton from "../../helper/Skeleton/Skeleton";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getUserRankAndTeamMetricsAsync } from "../../feature/user/userSlice";
import { DEFAULT_PER_PAGE_ITEMS } from "../../constants/appConstants";

const RoyalityAndRewards = () => {
  const dispatch = useDispatch();
  const { rankData = null, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getUserRankAndTeamMetricsAsync());
      } catch (error) {
        toast.error(error || "Server error");
      }
    })();
  }, []);

  const tableRef = useRef(null);
  useEffect(() => {
    if (tableRef.current && !isLoading && rankData) {
      const $table = $(tableRef.current);
      if (!$.fn.DataTable.isDataTable($table)) {
        $table.DataTable({
          pageLength: DEFAULT_PER_PAGE_ITEMS,
          responsive: true,
        });
      }
    }
  }, [rankData, isLoading]);

  return (
    <MasterLayout>
      <Breadcrumb title="Royalty&Reward"></Breadcrumb>
      <div className="card basic-data-table mt-5">
        <div className="!px-6 !py-3 !border-b-2 text-gray-600 flex justify-between items-center">
          <h5 className="card-title mb-0 ">User Royalty & Reward Table</h5>
        </div>

        <div className="card-body">
          <table
            ref={tableRef}
            className="table bordered-table mb-0"
            id="dataTable"
            data-page-length={DEFAULT_PER_PAGE_ITEMS}
          >
            <thead>
              <tr>
                <th scope="col">S.L</th>
                <th scope="col">Rank</th>
                <th scope="col">Self Business</th>
                <th scope="col">Direct Team</th>
                <th scope="col">Direct Business ($)</th>
                <th scope="col">Total Team Size</th>
                <th scope="col">Total Team Business ($)</th>
                <th scope="col">Reward(Monthly)</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
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
              ) : rankData ? (
                <tr>
                  <td>{"1"}</td>
                  <td>{rankData.rank}</td>
                  <td>${rankData.selfBusiness}</td>
                  <td>{rankData.directTeam}</td>
                  <td>${rankData.directBusiness}</td>
                  <td>{rankData.teamSize}</td>
                  <td>${rankData.teamBusiness}</td>
                  <td>{"0"}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    User Royalty And Reward History Not Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MasterLayout>
  );
};

export default RoyalityAndRewards;
