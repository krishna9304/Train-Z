import { Button, CircularProgress, TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import React, { useEffect, useState } from "react";
import PasswordField from "./PasswordField";
import { Config } from "../configs/server-urls";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { instantiateUser } from "../redux/slices/userSlice";
import { useCookies } from "react-cookie";

const SignUp = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    username: "",
    userType: "STUDENT",
  });
  const dispatch = useDispatch();
  const [isloading, setIsloading] = useState(false);
  const handleClick = () => {
    if (
      data.name.length &&
      data.email.length &&
      data.password.length &&
      data.phone.length &&
      data.username.length
    ) {
      axios
        .post(Config.SIGN_UP, data)
        .then((res) => {
          if (!res.data.result.data.err) {
            setIsloading(false);
            dispatch(
              instantiateUser(
                res.data.result.data.student || res.data.result.data.mentor
              )
            );
            document.cookie = "jwt=" + res.data.result.data.token;
          } else {
            toast("Error!", { type: "error" });
          }
        })
        .catch((e) => {
          console.error(e);
          setIsloading(false);
        });
    } else {
      setIsloading(false);
      toast("Fields can't be empty!", { type: "info" });
    }
  };
  return (
    <div className="w-full bg-white flex flex-col justify-center items-center gap-4">
      <TextField
        onChange={(e) =>
          setData((prevData) => ({
            ...prevData,
            name: e.target.value,
          }))
        }
        type={"text"}
        label="Name"
        required
        className="w-full"
        variant="standard"
      />
      <TextField
        onChange={(e) =>
          setData((prevData) => ({
            ...prevData,
            username: e.target.value,
          }))
        }
        type={"text"}
        label="Username"
        required
        className="w-full"
        variant="standard"
      />
      <TextField
        onChange={(e) =>
          setData((prevData) => ({
            ...prevData,
            email: e.target.value,
          }))
        }
        type={"email"}
        label="Your Email"
        required
        className="w-full"
        variant="standard"
      />
      <TextField
        onChange={(e) =>
          setData((prevData) => ({
            ...prevData,
            phone: e.target.value,
          }))
        }
        type={"tel"}
        label="Your Phone"
        required
        className="w-full"
        variant="standard"
      />
      <PasswordField
        className="w-full"
        password={data.password}
        setPassword={(val) => {
          setData((prevdata) => ({
            ...prevdata,
            password: val,
          }));
        }}
      />
      <RadioGroup
        onChange={(e) => {
          setData((prevData) => ({
            ...prevData,
            userType: e.target.value,
          }));
        }}
        row
        className="w-full"
        aria-label="usertype"
        defaultValue="STUDENT"
        name="usertype"
      >
        <FormControlLabel value="MENTOR" control={<Radio />} label="Mentor" />
        <FormControlLabel value="STUDENT" control={<Radio />} label="Student" />
      </RadioGroup>
      <Button
        onClick={() => {
          setIsloading(true);
          handleClick();
        }}
        variant="outlined"
      >
        {isloading ? <CircularProgress /> : "Sign Up"}
      </Button>
    </div>
  );
};

export default SignUp;
