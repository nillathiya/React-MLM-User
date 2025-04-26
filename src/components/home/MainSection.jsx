import React from "react";
import bitxImage from "../../assets/cryptoImg.png";
import logoImg from "../../assets/logoo.png";
import { motion } from "framer-motion";
import { MdEnergySavingsLeaf } from "react-icons/md";
import "./MainSection.css";
import Card from "./card";

const MainSection = () => {
  return (
    <>
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Content */}
            <div className="col-md-6 mb-4 mb-md-0">
              <p style={{ color: "green" }}>
                <span style={{ color: "yellow" }}>
                  <MdEnergySavingsLeaf />
                </span>{" "}
                Get 100% Referral Income
              </p>
              <h1 className="display-4 fw-bold d-flex align-items-center gap-2">
                Welcome to
                <img src={logoImg} alt="BitX Logo" className="bitx_main_logo" />
              </h1>
              <h2>We're thrilled to have you on board</h2>
              <p className="lead">
                <strong>BitX</strong> is your gateway to the future of
                AI-powered Web3 delegation—where staking, mining, and blockchain
                optimization meet intelligent automation. Get ready to explore
                seamless crypto experiences, maximize rewards, and be part of a
                growing decentralized ecosystem.
              </p>
              <p>Let’s build the future of blockchain, together.</p>
            </div>

            {/* Right Image with Repeating Top-Bottom Animation */}
            <div className="col-md-6 text-center main_bitx_img">
              <motion.img
                src={bitxImage}
                alt="BitX Visual"
                className="img-fluid rounded"
                style={{ height: "600px", objectFit: "contain" }}
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
        <Card/>
      </section>
    </>
  );
};

export default MainSection;
