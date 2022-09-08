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
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";

export const LoginForm = ({ handleCloseModal }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    password: "",
    email: "",
    showPassword: false,
    showError: false,
    errorMessage: "",
  });
  const { mutate: loginUser } = useMutation(
    async (logInfo) => (await axiosClient.post("/auth/signin", logInfo)).data,
    {
      onSuccess: () => {
        navigate("/feed");
      },
      onError: (error) => {
        console.log(error);
        if (error.data)
          setInput((state) => ({
            ...state,
            showError: true,
            errorMessage: error.response.data.message,
          }));
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    loginUser({ email: input.email, password: input.password });
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
          <Alert severity="error">{input.errorMessage}</Alert>
        </Collapse>
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Stack>
    </Box>
  );
};
