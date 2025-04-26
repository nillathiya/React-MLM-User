import React from "react";
import Delegator from "../../assets/Delegator.png";
import { motion } from "framer-motion";
import cardImg1 from "../../assets/lock-crypto.png";
import cardImg2 from "../../assets/earning-trading.png";
import cardImg3 from "../../assets/wallet-crypto-icon.png";
import { CiStar } from "react-icons/ci";
import "./Home.css";

const DelegatorsProfits = () => {
  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
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

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#333333",
      transition: { duration: 0.3 },
    },
  };

  return (
    <section id="delegator" className="delegators-profits py-5">
      <div className="container">
        <div className="row align-items-center">
          <motion.div
            className="col-md-6 mb-4 mb-md-0 delegators-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariants}
          >
            <div>
              <h1 className="delegators-heading fw-bold d-flex flex-column flex-md-row align-items-center gap-2">
                Testimonials Millions of users around the world
              </h1>
              <p className="delegators-text">
                Items an exciting time to become a trader.
              </p>
              <motion.button
                className="delegators-button"
                whileHover="hover"
                variants={buttonVariants}
              >
                Learn more
              </motion.button>
            </div>

            <div className="steps-container">
              {[
                {
                  icon: cardImg1,
                  stars: Array(5).fill(<CiStar />),
                  text: "Great! This is one of the best apps I have ever used before.",
                },
                {
                  icon: cardImg2,
                  stars: Array(5).fill(<CiStar />),
                  text: "Great! Compared to everything else I have ever used, this is the best app.",
                },
                {
                  icon: cardImg3,
                  stars: Array(5).fill(<CiStar />),
                  text: "Great! This is one of the best apps I have ever used before.",
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
                    <img src={card.icon} alt="Testimonial Icon" />
                  </div>
                  <h3 className="star-rating">{card.stars}</h3>
                  <p>{card.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="col-md-6 text-center">
            <motion.img
              src={Delegator}
              alt="BitX Visual"
              className="img-fluid rounded delegators-img"
              variants={imageVariants}
              animate="animate"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DelegatorsProfits;