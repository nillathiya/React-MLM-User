import React from "react";
import logoImg from "../../assets/logoo.png";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-transparent py-3">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link to="/" className="navbar-brand">
          <img src={logoImg} alt="BitX Logo" width="120" />
        </Link>
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav gap-4">
            <li className="nav-item">
              <a className="nav-link" href="#who">
                Who We Are
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#how">
                How It Works
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#market">
                Market Opportunity
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#delegator">
                Delegators & Profits
              </a>
            </li>
          </ul>
        </div>
        <Link to={`connect-wallet`} className="connect_wallet_btn">
          Connect Wallet
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
