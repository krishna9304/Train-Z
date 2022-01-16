import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const PasswordField = ({ password, setPassword, className = "", ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <FormControl variant="standard" className={className}>
      <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
      <Input
        {...props}
        required
        fullWidth
        type={show ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => {
                setShow((s) => !s);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default PasswordField;
