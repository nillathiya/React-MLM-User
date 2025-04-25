import React from "react";
import cardImg1 from "../../assets/lock-crypto.png";
import cardImg2 from "../../assets/earning-trading.png";
import cardImg3 from "../../assets/wallet-crypto-icon.png";
import "./MainSection.css";

const Card = () => {
  return (
    <div className="steps-container">
      <div className="step-card">
        <div className="step-icon">
          {/* Placeholder for the lock icon */}
          <img src={cardImg1} alt="Lock Icon" />
        </div>
        <h3>REGISTER</h3>
        <p>
          <strong>BitX</strong> – your journey into AI-powered Web3 delegation
          starts here.
        </p>
      </div>

      <div className="step-card">
        <div className="step-icon">
          {/* Placeholder for the wallet icon */}
          <img src={cardImg2} alt="Wallet Icon" />
        </div>
        <h3>CONNECT YOUR WALLET</h3>
        <p>
          All supported wallets are now successfully integrated and working with
          BitX.
        </p>
      </div>

      <div className="step-card">
        <div className="step-icon">
          {/* Placeholder for the trading icon */}
          <img src={cardImg3} alt="Trading Icon" />
        </div>
        <h3>START BITX JOURNEY</h3>
        <p>
          With just <strong>10 USDT</strong>, you can activate your staking and
          start earning from the decentralized economy.
        </p>
      </div>
    </div>
  );
};

export default Card;
