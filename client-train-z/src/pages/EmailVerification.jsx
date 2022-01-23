import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { useLocation } from "react-router-dom";
import emailVerified from "../images/mailverified.svg";
import axios from "axios";
import { BACKEND_URL } from "../configs/server-urls";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const EmailVerification = () => {
  const spring = useSpring({
    from: {
      scale: 0.5,
      opacity: 0,
    },
    to: {
      scale: 1,
      opacity: 1,
    },
  });

  const search = useLocation().search;
  useEffect(() => {
    const token = new URLSearchParams(search).get("token");
    console.log(token);
    axios
      .get(BACKEND_URL + `/auth/emailverification/${token}`)
      .then(({ data }) => {
        console.log(data);
        if (data.res) {
          toast("Email Verified!");
        } else if (data.errs) {
          data.errs.forEach((err) => toast(err, { type: "warning" }));
        }
      });
    return () => {};
  }, []);

  return (
    <div
      className={`min-h-screen w-full flex flex-col gap-10 justify-center items-center`}
    >
      <Navbar />
      <animated.img
        style={spring}
        className="max-w-xs"
        src={emailVerified}
        alt="Email Verified"
      />
    </div>
  );
};

export default EmailVerification;
