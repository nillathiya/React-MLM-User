import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserOrdersAsync } from "../../feature/order/orderSlice";
import Skeleton from "../../helper/Skeleton/Skeleton";
import toast from "react-hot-toast";

const UserActivityCard = () => {
  const dispatch = useDispatch();
  const { currentUser: loggedInUser } = useSelector((state) => state.auth);
  const { userOrders = [], loading: userOrdersLoading } = useSelector(
    (state) => state.orders
  );
  const { incomeTransactions = [], incomeTransactionsLoading } = useSelector(
    (state) => state.transaction
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userOrders.length === 0) {
          await dispatch(getUserOrdersAsync(loggedInUser?._id)).unwrap();
        }
      } catch (error) {
        toast.error(error.message || "Server Failed...");
      }
    };

    if (loggedInUser?._id) {
      fetchData();
    }
  }, [loggedInUser, userOrders.length, dispatch]);

  // Calculating user total package amount
  const totalPackageAmount = userOrders.reduce((acc, order) => {
    if (order.status === 1) acc += order.amount;
    return acc;
  }, 0);

  const {
    totalDailyStackReward,
    totalStackSponserReward,
    totalTeamPerformanceReward,
    totalReward,
    totalTeamDevelopmentReward,
  } = incomeTransactions.reduce(
    (acc, transaction) => {
      if (transaction.status === 1) {
        if (transaction.source === "roi") {
          acc.totalDailyStackReward += transaction.amount;
        }
        if (transaction.source === "direct") {
          acc.totalStackSponserReward += transaction.amount;
        }
        if (transaction.source === "referral") {
          acc.totalTeamPerformanceReward += transaction.amount;
        }
        if (transaction.source === "reward") {
          acc.totalReward += transaction.amount;
        }
        if (transaction.source === "royalty") {
          acc.totalTeamDevelopmentReward += transaction.amount;
        }
      }

      return acc;
    },
    {
      totalDailyStackReward: 0,
      totalStackSponserReward: 0,
      totalTeamPerformanceReward: 0,
      totalReward: 0,
      totalTeamDevelopmentReward: 0,
    }
  );

  return (
    <div className="row gy-4">
      <div className="col-xxl-3 col-sm-6">
        <div className="card p-3 shadow-2 radius-8 h-100 gradient-deep-two-1 border border-white">
          <div className="card-body p-0">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
              <div className="d-flex align-items-center gap-10">
                <span className="mb-0 w-48-px h-48-px bg-cyan-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0">
                  <img
                    src="assets/images/home-eleven/icons/home-eleven-icon1.svg"
                    alt=""
                  />
                </span>
                <div>
                  <span className="fw-medium text-secondary-light text-md ">
                    My Package
                  </span>
                  {userOrdersLoading ? (
                    <Skeleton
                      width="80px"
                      height="20px"
                      className="block mx-auto mt-1"
                    />
                  ) : (
                    <h6 className="fw-semibold mt-2">${totalPackageAmount}</h6>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-sm-6">
        <div className="card p-3 shadow-2 radius-8 h-100 gradient-deep-two-2 border border-white">
          <div className="card-body p-0">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
              <div className="d-flex align-items-center gap-10">
                <span className="mb-0 w-48-px h-48-px bg-warning-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0">
                  <img
                    src="assets/images/home-eleven/icons/home-eleven-icon2.svg"
                    alt=""
                  />
                </span>
                <div>
                  <span className="fw-medium text-secondary-light text-md">
                    Daily Stake Reward
                  </span>
                  {incomeTransactionsLoading ? (
                    <Skeleton
                      width="80px"
                      height="20px"
                      className="block mx-auto mt-1"
                    />
                  ) : (
                    <h6 className="fw-semibold mt-2">
                      ${totalDailyStackReward}
                    </h6>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-sm-6">
        <div className="card p-3 shadow-2 radius-8 h-100 gradient-deep-two-3 border border-white">
          <div className="card-body p-0">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
              <div className="d-flex align-items-center gap-10">
                <span className="mb-0 w-48-px h-48-px bg-lilac-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0">
                  <img
                    src="assets/images/home-eleven/icons/home-eleven-icon3.svg"
                    alt=""
                  />
                </span>
                <div>
                  <span className="fw-medium text-secondary-light text-md">
                    Stake Sponsor Reward
                  </span>
                  {incomeTransactionsLoading ? (
                    <Skeleton
                      width="80px"
                      height="20px"
                      className="block mx-auto mt-1"
                    />
                  ) : (
                    <h6 className="fw-semibold mt-2">
                      ${totalStackSponserReward}
                    </h6>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-sm-6">
        <div className="card p-3 shadow-2 radius-8 h-100 gradient-deep-two-4 border border-white">
          <div className="card-body p-0">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
              <div className="d-flex align-items-center gap-10">
                <span className="mb-0 w-48-px h-48-px bg-success-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0">
                  <img
                    src="assets/images/home-eleven/icons/home-eleven-icon4.svg"
                    alt=""
                  />
                </span>
                <div>
                  <span className="fw-medium text-secondary-light text-md">
                    Team Performance Reward
                  </span>
                  {incomeTransactionsLoading ? (
                    <Skeleton
                      width="80px"
                      height="20px"
                      className="block mx-auto mt-1"
                    />
                  ) : (
                    <h6 className="fw-semibold mt-2">
                      ${totalTeamPerformanceReward}
                    </h6>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-sm-6">
        <div className="card p-3 shadow-2 radius-8 h-100 gradient-deep-two-4 border border-white">
          <div className="card-body p-0">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
              <div className="d-flex align-items-center gap-10">
                <span className="mb-0 w-48-px h-48-px bg-success-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0">
                  <img
                    src="assets/images/home-eleven/icons/home-eleven-icon4.svg"
                    alt=""
                  />
                </span>
                <div>
                  <span className="fw-medium text-secondary-light text-md">
                    Reward
                  </span>
                  {incomeTransactionsLoading ? (
                    <Skeleton
                      width="80px"
                      height="20px"
                      className="block mx-auto mt-1"
                    />
                  ) : (
                    <h6 className="fw-semibold mt-2">${totalReward}</h6>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-sm-6">
        <div className="card p-3 shadow-2 radius-8 h-100 gradient-deep-two-3 border border-white">
          <div className="card-body p-0">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
              <div className="d-flex align-items-center gap-10">
                <span className="mb-0 w-48-px h-48-px bg-success-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0">
                  <img
                    src="assets/images/home-eleven/icons/home-eleven-icon4.svg"
                    alt=""
                  />
                </span>
                <div>
                  <span className="fw-medium text-secondary-light text-md">
                    Team Development Reward
                  </span>
                  {incomeTransactionsLoading ? (
                    <Skeleton
                      width="80px"
                      height="20px"
                      className="block mx-auto mt-1"
                    />
                  ) : (
                    <h6 className="fw-semibold mt-2">
                      ${totalTeamDevelopmentReward}
                    </h6>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivityCard;
