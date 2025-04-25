import React from "react";
import bitXwork from "../../assets/bitXwork.png";
import { motion } from "framer-motion";
import cardImg1 from "../../assets/lock-crypto.png";
import cardImg2 from "../../assets/earning-trading.png";
import cardImg3 from "../../assets/wallet-crypto-icon.png";
import "./MainSection.css";

const HowItWorks = () => {
  return (
    <section id="how" className="py-5 how_works_bg">
      <div className="container">
        <div className="text-center">
          <h3 style={{ color: "green" }}>Features</h3>
          <h1>How Does BitX Works?</h1>
          <p>
            BitX uses AI to automatically allocate and optimize your staking and
            mining across multiple blockchains, then delivers real-time earnings
            and insights through a simple, interactive dashboard.
          </p>
        </div>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-icon">
              {/* Placeholder for the lock icon */}
              <img src={cardImg1} alt="Lock Icon" />
            </div>
            <h3>BitX Generates Profits</h3>
            <p>
              Automated staking. Real-time rewards. Smarter earnings—powered by
              AI.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon">
              {/* Placeholder for the wallet icon */}
              <img src={cardImg2} alt="Wallet Icon" />
            </div>
            <h3>BitX AI Mining Profit</h3>
            <p>
              AI-driven mining for maximum returns—fast, smart, and fully
              automated.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon">
              {/* Placeholder for the trading icon */}
              <img src={cardImg3} alt="Trading Icon" />
            </div>
            <h3>Register on BitX with Only USDT (BEP-20)</h3>
            <p>
              Quick, secure, and easy onboarding using Binance Smart Chain USDT.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon">
              {/* Placeholder for the trading icon */}
              <img src={cardImg3} alt="Trading Icon" />
            </div>
            <h3>Bitx Staking for Beginners</h3>
            <p>
              Staking Bitx lets you earn rewards by locking your Bitx tokens in
              a secure wallet. To start, create an account, deposit Bitx, choose
              a staking plan, and begin earning.
            </p>
          </div>
        </div>

        <div className="row align-items-center">
          {/* Left Content */}
          <div className="col-md-6 mb-4 mb-md-0">
            <h1
              className=" how_does_heading fw-bold d-flex align-items-center gap-2"
              style={{ fontFamily: "Sans-serif" }}
            >
              Why BitX Supports Your Dream
            </h1>
            <p className="who_are_you_bitx">
              BitX is here to help you achieve your dreams by offering secure
              and easy-to-use crypto solutions. Whether you're staking or
              investing, BitX provides the tools to grow your wealth and make
              your financial goals a reality. Your success is their mission.
            </p>
            <p></p>
          </div>

          {/* Right Image with Repeating Top-Bottom Animation */}
          <div className="col-md-6 text-center">
            <motion.img
              src={bitXwork}
              alt="BitX Visual"
              className="img-fluid rounded"
              style={{ height: "700px", objectFit: "contain" }}
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
