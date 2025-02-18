import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import MasterLayout from "../../masterLayout/MasterLayout";
import "./withdrawal.css";

const ArbWithdrawal = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Fund Transfer History"></Breadcrumb>
      <div className="withdrwal_main">
        <div className="radius-16">
          <div className="p-0">
            <div className="p-20">
            {/* <h6 className="mb-2 fw-bold text-lg mb-0 text-white">Withdraw</h6> */}
              <div className="position-relative z-1 py-32 text-center px-3">
                <img
                  src="/assets/images/home-eleven/bg/bg-orange-gradient.png"
                  alt=""
                  className="position-absolute top-0 start-0 w-100 h-100 z-n1"
                />
                <div className="withdrwal_condition_section">
                  <div className="withdrwal_inner_section">
                    <div>
                      <h6 style={{ color: "white" }}>PAYOUT PAID AMOUNT</h6>
                      <h4>0</h4>
                    </div>
                    <div className="withdrwal_show_payment">$</div>
                  </div>
                  <div className="withdrawal_minimunm_payout">
                    <div>
                      <p
                        className="minimum_payout_amount"
                        style={{ color: "white", fontSize: "20px" }}
                      >
                        Minimum payout amount
                      </p>
                      <h6 style={{ fontWeight: "bold" }}>$ 10</h6>
                    </div>
                    <div style={{marginLeft:"30px"}}>
                      <p
                        className="minimum_amount"
                        style={{ color: "white", fontSize: "20px" }}
                      >
                        Withdrawal Conditions
                      </p>
                      <p
                        className="all_available"
                        style={{ fontWeight: "bold" }}
                      >
                        All the Withdrawals Available 24x7
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="withdrawal_pauout_request mt-5">
          <div className="card_payout_header">
            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
              <h6 className="mb-2 fw-bold text-lg mb-0 text-white">
                Payout Request
              </h6>
              <p className="text-white">
                Main Wallet :
                <span style={{ color: "green" }}>$ 610.4025000000003</span>
              </p>
            </div>
            <div className="p-0">
              <form>
                <label className="text-white">PAYOUT AMOUNT *</label> <br />
                <input type="number" className="payout_ammount_input" />
                <br />
                <button className="withdrwal_btn">submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default ArbWithdrawal;
