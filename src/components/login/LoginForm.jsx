import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Collapse,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export const LoginForm = ({ handleCloseModal }) => {
  const [input, setInput] = useState({
    password: "",
    email: "",
    showPassword: false,
    showError: false,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    //TODO: Login logic
  };
  const handleChange = (field) => (e) => {
    setInput({
      ...input,
      [field]: e.target.value,
      showError: false,
    });
  };
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap={2}>
        <TextField
          required
          label="Email"
          value={input.email}
          onChange={handleChange("email")}
        ></TextField>
        <TextField
          required
          type={input.showPassword ? "text" : "password"}
          label="Password"
          value={input.password}
          style={{ minHeight: "80px" }}
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
        <Collapse in={input.showError}>
          <Alert severity="error">Email or password is incorrect</Alert>
        </Collapse>
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Stack>
    </Box>
  );
};
