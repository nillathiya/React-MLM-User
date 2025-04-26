import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoImg from "../../assets/logoo.png";
import "./Navbar.css";

const Navbar = () => {
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.1,
      color: "#000000",
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 },
    },
  };

  const handleNavClick = (e) => {
    e.stopPropagation(); // Prevent click from closing the menu
  };

  return (
    <motion.nav
      className="navbar navbar-expand-lg bg-transparent py-3"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="container">
        <Link to="/" className="navbar-brand">
          <motion.img
            src={logoImg}
            alt="BitX Logo"
            width="120"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav gap-4">
            <motion.li
              className="nav-item"
              whileHover="hover"
              variants={linkVariants}
            >
              <a className="nav-link" href="#who" onClick={handleNavClick}>
                Who We Are
              </a>
            </motion.li>
            <motion.li
              className="nav-item"
              whileHover="hover"
              variants={linkVariants}
            >
              <a className="nav-link" href="#how" onClick={handleNavClick}>
                How It Works
              </a>
            </motion.li>
            <motion.li
              className="nav-item"
              whileHover="hover"
              variants={linkVariants}
            >
              <a className="nav-link" href="#market" onClick={handleNavClick}>
                Market Opportunity
              </a>
            </motion.li>
            <motion.li
              className="nav-item"
              whileHover="hover"
              variants={linkVariants}
            >
              <a className="nav-link" href="#delegator" onClick={handleNavClick}>
                Delegators & Profits
              </a>
            </motion.li>
          </ul>
        </div>
        <Link to="/connect-wallet">
          <motion.div
            className="connect_wallet_btn"
            whileHover="hover"
            variants={buttonVariants}
          >
            Connect Wallet
          </motion.div>
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;