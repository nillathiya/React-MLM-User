import React from "react";
import whoAreYou from "../../assets/whoAreYou.png";
import { motion } from "framer-motion";
import "./WhoWeAre.css";

const WhoWeAre = () => {
  return (
    <section id="who" className="py-5 who_are_bg">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Content */}
          <div className="col-md-6 text-center">
            <motion.img
              src={whoAreYou}
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
            <h1
              className="how_are_heading fw-bold d-flex align-items-center gap-2"
              style={{ fontFamily: "Sans-serif" }}
            >
              Stake BitX Anytime, Anywhere
            </h1>
            <p className="who_are_you_bitx">
              With BitX, you’re no longer tied to one place or platform. Whether
              you're at home, on the move, or halfway around the world — staking
              is just a tap away.
            </p>
            <p className="who_are_you_bitx">
              We focus on:
              <ul>
                <li>✅ Accessible on mobile & desktop</li>
                <li>✅ Secure, AI-optimized staking</li>
                <li>✅ Real-time rewards from anywhere</li>
              </ul>
            </p>
            <h6>Your crypto, your control — stake BitX anytime, anywhere.</h6>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
