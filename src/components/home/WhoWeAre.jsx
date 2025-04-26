import React from "react";
import whoAreYou from "../../assets/whoAreYou.png";
import { motion } from "framer-motion";
import "./Home.css";

const WhoWeAre = () => {
  const textVariants = {
    hidden: { opacity: 0, x: 50 },
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

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.2 },
    }),
    hover: {
      scale: 1.05,
      color: "#000000",
      transition: { duration: 0.3 },
    },
  };

  const headingVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section id="who" className="who-we-are py-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Image */}
          <div className="col-md-6 text-center mb-4 mb-md-0">
            <motion.img
              src={whoAreYou}
              alt="BitX Visual"
              className="img-fluid rounded who-are-img"
              variants={imageVariants}
              animate="animate"
            />
          </div>
          {/* Right Content */}
          <motion.div
            className="col-md-6 who-are-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariants}
          >
            <motion.h1
              className="who-are-heading fw-bold d-flex align-items-center gap-2"
              style={{ fontFamily: "Sans-serif" }}
              whileHover="hover"
              variants={headingVariants}
            >
              Stake BitX Anytime, Anywhere
            </motion.h1>
            <motion.p
              className="who-are-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              With BitX, you’re no longer tied to one place or platform. Whether
              you're at home, on the move, or halfway around the world — staking
              is just a tap away.
            </motion.p>
            <motion.p
              className="who-are-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              We focus on:
              <ul className="feature-list">
                {[
                  "Accessible on mobile & desktop",
                  "Secure, AI-optimized staking",
                  "Real-time rewards from anywhere",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={listItemVariants}
                    whileHover="hover"
                  >
                    ✅ {item}
                  </motion.li>
                ))}
              </ul>
            </motion.p>
            <motion.h6
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Your crypto, your control — stake BitX anytime, anywhere.
            </motion.h6>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;