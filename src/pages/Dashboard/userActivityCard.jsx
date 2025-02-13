import React from "react";

const UserActivityCard = () => {
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
                  <span className="fw-medium text-secondary-light text-md">
                    Total Users
                  </span>
                  <h6 className="fw-semibold mt-2">12</h6>
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
                    Active
                  </span>
                  <h6 className="fw-semibold mt-2">12</h6>
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
                    Total Investment
                  </span>
                  <h6 className="fw-semibold mt-2">22250</h6>
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
                    Total Income
                  </span>
                  <h6 className="fw-semibold mt-2">2709.3826</h6>
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
                    Income Charge
                  </span>
                  <h6 className="fw-semibold mt-2">0</h6>
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
