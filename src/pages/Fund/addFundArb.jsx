import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import './fund.css'

const AddFundArb = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Add Fund"></Breadcrumb>
      <div className="add_fund_sec">
        <form className="fund-form">
          <input type="text" placeholder="Enter Amount in ARB" className="input-field"/>
          <select name="fund-option" className="select-field">
            <option value="USDT(BEP20)">ARB (BEP20)</option>
          </select>
          <button className="connect-wallet-btn">Connect Wallet</button>
        </form>
      </div>
    </MasterLayout>
  )
}

export default AddFundArb
