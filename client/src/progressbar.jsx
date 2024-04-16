import React from "react";


const ProgressBar = ({ completed }) => {
  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{ width: `${completed}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
