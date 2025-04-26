import React from "react";
import Delegator from "../../assets/Delegator.png";
import { motion } from "framer-motion";
import cardImg1 from "../../assets/lock-crypto.png";
import cardImg2 from "../../assets/earning-trading.png";
import cardImg3 from "../../assets/wallet-crypto-icon.png";
import { CiStar } from "react-icons/ci";
import "./DelegatorsProfits.css";

const DelegatorsProfits = () => {
  return (
    <section id="delegator" className="py-5 deligator_bg">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Content */}
          <div className="col-md-6 mb-4 mb-md-0">
            <div>
              <h1
                className="deligate_heading fw-bold d-flex flex-column flex-md-row align-items-center gap-2"
                style={{ fontFamily: "Sans-serif" }}
              >
                <span>Testimonials Millions of users around the world</span>
              </h1>
              <p>Items an exciting time to become a trader.</p>
              <button
                style={{
                  background: "#000000",
                  color: "white",
                  padding: "10px",
                  borderRadius: "25px",
                  fontWeight: "bold",
                }}
              >
                Learn more
              </button>
            </div>

            <div className="steps-container">
              <div className="step-card">
                <div className="step-icon">
                  {/* Placeholder for the lock icon */}
                  <img src={cardImg1} alt="Lock Icon" />
                </div>
                <h3>
                  <CiStar />
                  <CiStar />
                  <CiStar />
                  <CiStar />
                  <CiStar />
                </h3>
                <p>
                  Great! This is one of the best apps I have ever used before.
                </p>
              </div>

              <div className="step-card">
                <div className="step-icon">
                  {/* Placeholder for the wallet icon */}
                  <img src={cardImg2} alt="Wallet Icon" />
                </div>
                <h3>
                  <CiStar />
                  <CiStar />
                  <CiStar />
                  <CiStar />
                  <CiStar />
                </h3>
                <p>
                  Great! Compared to everything else i have ever used, this is
                  the best app
                </p>
              </div>

              <div className="step-card">
                <div className="step-icon">
                  {/* Placeholder for the trading icon */}
                  <img src={cardImg3} alt="Trading Icon" />
                </div>
                <h3>
                  <CiStar />
                  <CiStar />
                  <CiStar />
                  <CiStar />
                  <CiStar />
                </h3>
                <p>
                  Great! This is one of the best apps I have ever used before.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image with Repeating Top-Bottom Animation */}
          <div className="col-md-6 text-center">
            <motion.img
              src={Delegator}
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

export default DelegatorsProfits;
