import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { InputAdornment, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";

const PasswordFields = ({ input, setInput, handleChange}) => {
  return (
    <>
      <Stack>
        <TextField
          required
          type={input.showPassword ? "text" : "password"}
          label="Password"
          value={input.password}
          style={{ minHeight: "80px" }}
          error={!input.passwordValid && input.password !== ""}
          helperText={
            !input.passwordValid && input.password !== ""
              ? "Minimum eight characters, at least one letter and one number"
              : ""
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {input.showPassword ? (
                  <Visibility
                    cursor={"pointer"}
                    onClick={() =>
                      setInput((state) => ({
                        ...state,
                        showPassword: !state.showPassword,
                      }))
                    }
                  />
                ) : (
                  <VisibilityOff
                    cursor={"pointer"}
                    onClick={() =>
                      setInput((state) => ({
                        ...state,
                        showPassword: !state.showPassword,
                      }))
                    }
                  />
                )}
              </InputAdornment>
            ),
          }}
          onChange={handleChange("password")}
        ></TextField>
        <TextField
          required
          error={!input.passwordsMatch && input.confirmPassword !== ""}
          helperText={
            !input.passwordsMatch && input.confirmPassword
              ? "Passwords don't match"
              : ""
          }
          type={input.showPassword ? "text" : "password"}
          style={{ minHeight: "80px" }}
          label="Confirm password"
          value={input.confirmPassword}
          onChange={handleChange("confirmPassword")}
        ></TextField>
      </Stack>
    </>
  );
};

export default PasswordFields;
