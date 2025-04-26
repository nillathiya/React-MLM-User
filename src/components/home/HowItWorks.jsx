import React from "react";
import bitXwork from "../../assets/bitXwork.png";
import { motion } from "framer-motion";
import cardImg1 from "../../assets/lock-crypto.png";
import cardImg2 from "../../assets/earning-trading.png";
import cardImg3 from "../../assets/wallet-crypto-icon.png";
import "./Home.css";

const HowItWorks = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const imageVariants = {
    animate: {
      y: [-15, 15],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.2 },
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <section id="how" className="how-it-works py-5">
      <div className="container">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textVariants}
        >
          <h3 className="features-title">Features</h3>
          <h1 className="how-it-works-heading">How Does BitX Work?</h1>
          <p className="how-it-works-text">
            BitX uses AI to automatically allocate and optimize your staking and
            mining across multiple blockchains, then delivers real-time earnings
            and insights through a simple, interactive dashboard.
          </p>
        </motion.div>
        <div className="steps-container">
          {[
            {
              icon: cardImg1,
              title: "BitX Generates Profits",
              text: "Automated staking. Real-time rewards. Smarter earnings—powered by AI.",
            },
            {
              icon: cardImg2,
              title: "BitX AI Mining Profit",
              text: "AI-driven mining for maximum returns—fast, smart, and fully automated.",
            },
            {
              icon: cardImg3,
              title: "Register on BitX with Only USDT (BEP-20)",
              text: "Quick, secure, and easy onboarding using Binance Smart Chain USDT.",
            },
            {
              icon: cardImg3,
              title: "Bitx Staking for Beginners",
              text: "Staking Bitx lets you earn rewards by locking your Bitx tokens in a secure wallet. To start, create an account, deposit Bitx, choose a staking plan, and begin earning.",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="step-card"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="step-icon">
                <img src={card.icon} alt={`${card.title} Icon`} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="row align-items-center">
          <motion.div
            className="col-md-6 mb-4 mb-md-0 how-it-works-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariants}
          >
            <h1 className="how-it-works-heading fw-bold d-flex align-items-center gap-2">
              Why BitX Supports Your Dream
            </h1>
            <p className="how-it-works-text">
              BitX is here to help you achieve your dreams by offering secure
              and easy-to-use crypto solutions. Whether you're staking or
              investing, BitX provides the tools to grow your wealth and make
              your financial goals a reality. Your success is their mission.
            </p>
          </motion.div>

          <div className="col-md-6 text-center">
            <motion.img
              src={bitXwork}
              alt="BitX Visual"
              className="img-fluid rounded how-it-works-img"
              variants={imageVariants}
              animate="animate"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;