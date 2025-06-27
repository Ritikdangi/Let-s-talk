import React from 'react';
import { BsChatDots } from "react-icons/bs";

const Logo = ({ size = "default" }) => {
  const sizeClasses = {
    small: {
      icon: "text-2xl md:text-3xl",
      text: "text-lg md:text-xl",
      container: "space-x-1"
    },
    default: {
      icon: "text-4xl md:text-5xl",
      text: "text-2xl md:text-3xl",
      container: "space-x-2"
    },
    large: {
      icon: "text-5xl md:text-6xl",
      text: "text-3xl md:text-4xl",
      container: "space-x-3"
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center justify-center">
      <div className={`flex items-center ${classes.container}`}>
        <div className="relative">
          <BsChatDots className={`${classes.icon} text-green-500`} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <div className="flex flex-col">
          <span className={`${classes.text} font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent`}>
            Let's
          </span>
          <span className={`${classes.text} font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent -mt-1`}>
            Talk
          </span>
        </div>
      </div>
    </div>
  );
};

export default Logo; 