import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import "./fund.css";

const FundConvert = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Fund Convert"></Breadcrumb>
      <div className="add_fund_sec">
        <form className="fund-form">
          <label>Select From Wallet</label>
          <select name="fund-option" className="select-field">
            <option value="USDT(BEP20)">Select Wallet</option>
            <option value="USDT(BEP20)">Main Wallet</option>
          </select>
          <label>Select To Wallet</label>
          <select name="fund-option" className="select-field">
            <option value="USDT(BEP20)">Select Wallet</option>
            <option value="USDT(BEP20)">Fund Wallet</option>
          </select>
          <label>Enter Amount</label>
          <input type="number" placeholder="Enter Ammount" />

          <button className="connect-wallet-btn">Convert</button>
        </form>
      </div>
    </MasterLayout>
  );
};

export default FundConvert;
