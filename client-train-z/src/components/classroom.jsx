import React from "react";
import { Link } from "react-router-dom";
const ClassroomAvatar = ({ className, src, ...props }) => {
  return (
    <Link
      to={`/class/${src}`}
      {...props}
      className={
        "w-20 h-20 cursor-pointer transform hover:scale-110 duration-100 hover:bg-white text-xl rounded-full flex items-center justify-center " +
        className
      }
    >
      {src}
    </Link>
  );
};

export default ClassroomAvatar;
