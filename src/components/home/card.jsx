import React from "react";
import { motion } from "framer-motion";
import cardImg1 from "../../assets/lock-crypto.png";
import cardImg2 from "../../assets/earning-trading.png";
import cardImg3 from "../../assets/wallet-crypto-icon.png";
import "./Home.css";

const Card = () => {
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
    <div className="card-section steps-container">
      {[
        {
          icon: cardImg1,
          title: "REGISTER",
          text: "<strong>BitX</strong> – your journey into AI-powered Web3 delegation starts here.",
        },
        {
          icon: cardImg2,
          title: "CONNECT YOUR WALLET",
          text: "All supported wallets are now successfully integrated and working with BitX.",
        },
        {
          icon: cardImg3,
          title: "START BITX JOURNEY",
          text: "With just <strong>10 USDT</strong>, you can activate your staking and start earning from the decentralized economy.",
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
          <p dangerouslySetInnerHTML={{ __html: card.text }} />
        </motion.div>
      ))}
    </div>
  );
};

export default Card;