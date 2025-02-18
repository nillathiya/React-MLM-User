import React from "react";
import PropTypes from "prop-types";
import "./skeleton.css"; // Import the CSS file

const Skeleton = ({ width, height, className }) => {
  return (
    <div className={`skeleton ${className}`} style={{ width, height }}></div>
  );
};

Skeleton.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
};

Skeleton.defaultProps = {
  width: "100%",
  height: "1rem",
  className: "",
};

export default Skeleton;
