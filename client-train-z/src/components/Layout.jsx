import React from "react";
import Navbar from "./Navbar";
import { useSpring, animated } from "react-spring";

const Layout = ({
  className,
  detailedNav = false,
  childrenClassName,
  children,
  ...props
}) => {
  const spring = useSpring({
    to: {
      opacity: 1,
      marginLeft: 0,
    },
    from: {
      opacity: 0,
      marginLeft: -window.innerWidth * 5,
    },
    delay: 50,
  });
  return (
    <div {...props} className={`w-full min-h-screen mt-14 ${className}`}>
      <Navbar detailed={detailedNav} className="" />
      <animated.div className={childrenClassName} style={spring}>
        {children}
      </animated.div>
    </div>
  );
};

export default Layout;
