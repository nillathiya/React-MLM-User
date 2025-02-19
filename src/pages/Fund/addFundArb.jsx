import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import "./fund.css";

const AddFundArb = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Add Fund"></Breadcrumb>
      <div className="payment-container">
        <div className="payment-box">
          {/* <label>Enter Amount ARB</label> */}
          <input
            type="text"
            placeholder="Enter Amount ARB"
            className="input-field"
          />

          <div className="amount-section">
            <div className="token-selectarb">
              <div className="token-dropdownarb">
                <select>
                  <option value="token">Token Select</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
            </div>
          </div>

          <button className="submit-btn">Connect Wallet</button>
        </div>
      </div>
    </MasterLayout>
  );
};

export default AddFundArb;
