import React from 'react'
import oprtunity from "../../assets/oprtunity.png";
import { motion } from "framer-motion";
import "./MarketOpportunity.css";

const MarketOpportunity = () => {
  return (
    <section id='market' className="py-5 who_are_bg">
    <div className="container">
      <div className="row align-items-center">
        {/* Left Content */}
        <div className="col-md-6 text-center">
          <motion.img
            src={oprtunity}
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
        {/* Right Image with Repeating Top-Bottom Animation */}
        <div className="col-md-6 mb-4 mb-md-0">
          <h1 className=" oportunity_heading fw-bold d-flex align-items-center gap-2" style={{ fontFamily: "Sans-serif" }}>
          We got everything you need to start trading
          </h1>
          <p className="who_are_you_bitx">
          The Bitcoin and cryptocurrency markets have experienced a surge in volume recently, making it an exciting time to become a trader.
          </p>
          <p className="who_are_you_bitx">
            We focus on:
            <ul>
              <li>
              Top trading platform</li>
              <li>Secure payments</li>
              <li>Easy to start trading</li>
            </ul>
          </p>
        
        </div>
      </div>
    </div>
  </section>
  )
}

export default MarketOpportunity
