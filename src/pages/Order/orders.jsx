import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import Skeleton from "../../helper/Skeleton/Skeleton";
import "./orders.css";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getUserOrdersAsync } from "../../feature/order/orderSlice";
import { DEFAULT_PER_PAGE_ITEMS } from "../../constants/appConstants";
import { formatDate } from "../../utils/dateUtils.js";

const Orders = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { userOrders, loading } = useSelector((state) => state.orders);
  const [calculatingTotalPackageAmount, setCalculatingTotalPackageAmount] =
    useState(true);
  const [totalPackageAmount, setTotalPackageAmount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (currentUser?._id) {
      (async () => {
        try {
          await dispatch(getUserOrdersAsync(currentUser._id)).unwrap();
        } catch (error) {
          if (isMounted) toast.error(error || "Unexpected error occurred");
        }
      })();
    }
  
    return () => {
      isMounted = false;
    };
  }, [dispatch, currentUser?._id]); 
  
  useEffect(() => {
    if (!loading && userOrders?.length) {
      setTimeout(() => {
        if ($.fn.DataTable.isDataTable("#dataTable")) {
          $("#dataTable").DataTable().destroy();
        }
        $("#dataTable").DataTable({
          destroy: true,
          pageLength: DEFAULT_PER_PAGE_ITEMS,
          responsive: true,
        });
      }, 100);
    }
  }, [loading, userOrders]);
  

  useEffect(() => {
    if (!loading) {
      setCalculatingTotalPackageAmount(true);
      if (userOrders.length > 0) {
        const total = userOrders.reduce(
          (acc, order) => (order.status === 1 ? acc + order.amount : acc),
          0
        );
        setTotalPackageAmount(total);
      }
      setCalculatingTotalPackageAmount(false);
    }
  }, [loading, userOrders]);


  // console.log("loading",loading);

  return (
    <MasterLayout>
      <Breadcrumb title="Fund Transfer History" />
      <div className="Total_ammount mb-5">
        <div
          className={`flex flex-col justify-center items-center daily_total_income 
      `}
        >
          <h6 className="heading capitalize mb-2">Total Package Amount</h6>
          {calculatingTotalPackageAmount ? (
            <Skeleton width="80px" height="20px" className="block mx-auto" />
          ) : (
            <p className="font-semibold">${totalPackageAmount}</p>
          )}
        </div>
      </div>
      <div className="card basic-data-table">
        <div className="card-body">
          <table
            className="table bordered-table mb-0"
            id="dataTable"
            data-page-length={DEFAULT_PER_PAGE_ITEMS}
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
                [...Array(5)].map((_, index) => (
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
                ))
              ) : userOrders.length > 0 ? (
                userOrders.map((order, index) => (
                  <tr key={order._id || index}>
                    <td>{index + 1}</td>
                    <td>{order.amount}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.status===1 ? "Running" : "Outdated"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    User Orders Not Found
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

export default Orders;
