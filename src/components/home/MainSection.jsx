import React from "react";
import bitxImage from "../../assets/cryptoImg.png";
import logoImg from "../../assets/logoo.png";
import { motion } from "framer-motion";
import { MdEnergySavingsLeaf } from "react-icons/md";
import "./Home.css";

const MainSection = () => {
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

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: { duration: 0.3 },
    },
  };

  const logoVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="main-section py-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Content */}
          <motion.div
            className="col-md-6 mb-4 mb-md-0 main-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariants}
          >
            <p className="referral-text">
              <motion.span
                className="icon-wrapper"
                whileHover="hover"
                variants={iconVariants}
              >
                <MdEnergySavingsLeaf />
              </motion.span>{" "}
              Get 100% Referral Income
            </p>
            <h1 className="display-4 fw-bold d-flex align-items-center gap-2">
              Welcome to
              <motion.img
                src={logoImg}
                alt="BitX Logo"
                className="bitx-main-logo"
                whileHover="hover"
                variants={logoVariants}
              />
            </h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              We're thrilled to have you on board
            </motion.h2>
            <motion.p
              className="lead"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <strong>BitX</strong> is your gateway to the future of
              AI-powered Web3 delegation—where staking, mining, and blockchain
              optimization meet intelligent automation. Get ready to explore
              seamless crypto experiences, maximize rewards, and be part of a
              growing decentralized ecosystem.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Let’s build the future of blockchain, together.
            </motion.p>
          </motion.div>

          {/* Right Image */}
          <div className="col-md-6 text-center main-image">
            <motion.img
              src={bitxImage}
              alt="BitX Visual"
              className="img-fluid rounded"
              variants={imageVariants}
              animate="animate"
            />
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default MainSection;