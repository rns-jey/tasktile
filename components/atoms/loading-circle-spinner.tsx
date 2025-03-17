"use client";

import { motion } from "motion/react";

function LoadingCircleSpinner() {
  return (
    <div className="">
      <motion.div
        className="spinner border-4"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <StyleSheet />
    </div>
  );
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
  return (
    <style>
      {`
        .spinner {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-top-color: #ff0088;
            will-change: transform;
        }
      `}
    </style>
  );
}

export default LoadingCircleSpinner;
