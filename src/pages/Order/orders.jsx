import React, { useEffect, useState, useRef } from "react";
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
  const { companyInfo } = useSelector((state) => state.user);
  const { userOrders, loading } = useSelector((state) => state.orders);
  const [calculatingTotalPackageAmount, setCalculatingTotalPackageAmount] =
    useState(true);
  const [totalPackageAmount, setTotalPackageAmount] = useState(0);
  const tableRef = useRef(null);

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
    if (!loading && userOrders.length > 0) {
      setTimeout(() => {
        const $table = $(tableRef.current);

        // Check if DataTable is already initialized
        if (!$.fn.DataTable.isDataTable(tableRef.current)) {
          // Initialize DataTable only if it hasn't been initialized yet
          $table.DataTable({
            pageLength: DEFAULT_PER_PAGE_ITEMS,
            responsive: true,
          });
        }
      }, 300);
    }
  }, [loading && userOrders]);

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
      <div className="mb-5">
        <div className="flex !flex-col justify-center items-center !bg-white dark:!bg-gray-800 !p-4 !rounded-lg !shadow-md">
          <h6 className="!text-gray-800 dark:!text-gray-200 !text-lg !font-semibold !capitalize !mb-2">
            Total Package Amount
          </h6>
          {calculatingTotalPackageAmount ? (
            <Skeleton
              width="80px"
              height="20px"
              className="block mx-auto bg-gray-300 dark:bg-gray-600"
            />
          ) : (
            <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
              {companyInfo.CURRENCY}
              {totalPackageAmount}
            </p>
          )}
        </div>
      </div>

      <div className="card basic-data-table">
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table bordered-table mb-0"
              ref={tableRef}
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
                      <td>
                        {companyInfo.CURRENCY}
                        {order.amount}
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{order.status === 1 ? "Running" : "Outdated"}</td>
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
      </div>
    </MasterLayout>
  );
};

export default Orders;
