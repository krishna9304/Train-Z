import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import taken from "../images/taken.svg";

const NotFound = () => {
  const [timeRemaining, setTimeRemaining] = useState(10);
  const toastId = useRef(null);
  let navigate = useNavigate();
  useEffect(() => {
    setInterval(() => {
      setTimeRemaining((t) => t - 1);
    }, 1000);
    toastId.current = toast(`Redirecting to Home in ${timeRemaining}s.`, {
      autoClose: timeRemaining * 1000,
    });
    return () => {
      toast.dismiss(toastId.current);
    };
  }, []);
  useEffect(() => {
    toast.update(toastId.current, {
      render: `Redirecting to Home in ${timeRemaining}s.`,
      progress: timeRemaining / 10,
    });
    if (timeRemaining <= 0) {
      toast.dismiss(toastId.current);
      navigate("/");
    }
    return () => {};
  }, [timeRemaining]);
  return (
    <Layout
      className={`min-h-screen select-none flex justify-center items-center`}
    >
      <Box className="flex flex-col gap-4 justify-center items-center">
        <img
          draggable={false}
          src={taken}
          className="w-1/3 h-1/3"
          alt="Page Not found"
        />
        <Box className="space-y-4 shadow-lg shadow-sky-200 rounded-lg p-4 text-3xl bg-sky-400 text-white uppercase">
          <Box className="font-bold text-center underline">
            Oops! page not found
          </Box>
          <Box className="text-lg">
            The page you were looking for does not exist
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default NotFound;
