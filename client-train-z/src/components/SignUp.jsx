import { Button, TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import React, { useEffect, useState } from "react";
import PasswordField from "./PasswordField";

const SignUp = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    username: "",
    userType: "STUDENT",
  });
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
          console.log(data);
        }}
        variant="outlined"
      >
        Sign Up
      </Button>
    </div>
  );
};

export default SignUp;
