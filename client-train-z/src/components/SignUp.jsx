import { Button, CircularProgress, TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import React, { useState } from "react";
import PasswordField from "./PasswordField";
import { Config } from "../configs/server-urls";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { instantiateUser } from "../redux/slices/userSlice";

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
          console.log(res.data);
          setIsloading(false);
          if (res.data.res) {
            dispatch(
              instantiateUser({
                userType: res.data.userinfo.userType,
                ...res.data.userinfo.user,
              })
            );
            toast("Sign Up successful");
            document.cookie = "jwt=" + res.data.token;
          } else {
            if (res.data.errs)
              res.data.errs.forEach((err) => toast(err, { type: "warning" }));
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
        className="w-2/5"
        disabled={isloading}
      >
        {isloading ? <CircularProgress size={24} /> : "Sign Up"}
      </Button>
    </div>
  );
};

export default SignUp;
