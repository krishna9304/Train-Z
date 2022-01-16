import { RadioGroup } from "@headlessui/react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PasswordField from "./PasswordField";

const SignIn = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
    userType: "",
  });
  useEffect(() => {
    console.log(data);
    return () => {};
  }, [data]);
  const [remember, setRemember] = useState(true);
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
          row
          className="w-full"
          aria-label="usertype"
          defaultValue="STUDENT"
          name="usertype"
        >
          <FormControlLabel value="MENTOR" control={<Radio />} label="Mentor" />
          <FormControlLabel
            value="STUDENT"
            control={<Radio />}
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
        onClick={() => {
          console.log(data);
        }}
        variant="outlined"
      >
        Sign In
      </Button>
    </div>
  );
};

export default SignIn;
