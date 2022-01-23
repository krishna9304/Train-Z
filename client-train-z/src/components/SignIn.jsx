import {
  Button,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Config } from "../configs/server-urls";
import { instantiateUser } from "../redux/slices/userSlice";
import PasswordField from "./PasswordField";

const SignIn = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
    userType: "STUDENT",
  });
  const [remember, setRemember] = useState(true);
  const [isloading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const [, setCookie] = useCookies(["jwt"]);
  const handleClick = () => {
    if (data.username && data.password.length >= 8) {
      setIsloading(true);
      axios
        .post(Config.SIGN_IN, data)
        .then((res) => {
          if (res.data.res) {
            dispatch(
              instantiateUser({
                userType: res.data.userinfo.userType,
                ...res.data.userinfo.user,
              })
            );
            setCookie("jwt", res.data.token);
            toast("Sign in successful", { type: "success" });
          } else if (res.data.errs) {
            res.data.errs.forEach((err) => toast(err, { type: "info" }));
          }
          setIsloading(false);
        })
        .catch(console.error);
    } else toast("Invalid info!");
  };
  return (
    <div className="w-full flex-grow max-w-lg flex flex-col justify-around items-center">
      <div className="flex flex-col justify-center gap-4">
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
          variant="standard"
          className="w-full"
        />
        <div className="w-full flex flex-col items-end">
          <PasswordField
            password={data.password}
            setPassword={(val) =>
              setData((prevData) => ({ ...prevData, password: val }))
            }
          />
          <Link to="/auth/forgotpassword" className="text-xs">
            Forgot Password?
          </Link>
        </div>
        <RadioGroup
          onChange={(e) => {
            setData((prevData) => ({
              ...prevData,
              userType: e.target.value,
            }));
          }}
          value={data.userType}
          row
          className="w-full"
          aria-label="usertypein"
          defaultValue="STUDENT"
          name="usertypein"
        >
          <FormControlLabel
            value="MENTOR"
            control={<Radio name="usertypein" />}
            label="Mentor"
          />
          <FormControlLabel
            value="STUDENT"
            control={<Radio name="usertypein" />}
            label="Student"
          />
        </RadioGroup>
        <span>
          <Checkbox
            onChange={(e) => {
              setRemember(e.target.checked);
            }}
            checked={remember}
            name="remember"
            id="remember"
            size="small"
          />
          <label htmlFor="remember" className="text-gray-500 text-sm">
            Remember me
          </label>
          &nbsp;
        </span>
      </div>
      <Button
        className="w-2/5"
        disabled={isloading}
        onClick={handleClick}
        variant="outlined"
      >
        {isloading ? <CircularProgress size={24} /> : "Sign In"}
      </Button>
    </div>
  );
};

export default SignIn;
