import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import "./fund.css";

const TranseferFund = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Add Fund"></Breadcrumb>
      <div className="add_fund_sec">
        <form className="fund-form">
          <h6 className="fund_wallet_show">
            Fund wallet : <span>$ 0</span>
          </h6>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            className="input-field"
          />
          <label>Enter Ammount</label>
          <input
            type="number"
            placeholder="Enter Ammount"
            className="input-field"
          />
          <button className="connect-wallet-btn">Transfer</button>
        </form>
      </div>
    </MasterLayout>
  );
};

export default TranseferFund;
