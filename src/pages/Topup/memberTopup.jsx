import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import "./topup.css";

const MemberTopup = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="member Topup"></Breadcrumb>
      <div className="topup_sec">
        <form className="topup-form">
          <div className="topup_wallet_section">
            <p className="topup_wallet_show">
              Main wallet : <span>$ 610.4</span>
            </p>
            <p className="topup_wallet_show">
              Fund wallet : <span>$ 0</span>
            </p>
          </div>
          <label>Select Wallet</label>
          <select className="select-field">
            <option value="0">Select Wallet</option>
            <option value="1">Fund Wallet</option>
          </select>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            className="input-field"
          />
          <label>Select Stake Days</label>
          <select className="select-field">
            <option value="0">Select Stake Days</option>
            <option value="0">200 days</option>
            <option value="1">300 days</option>
            <option value="1">500 days</option>
          </select>
          <label>
            Ammount <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            placeholder="Enter Ammount"
            className="input-field"
          />
          <button className="topup-wallet-btn">Topup</button>
        </form>
      </div>
    </MasterLayout>
  );
};

export default MemberTopup;
