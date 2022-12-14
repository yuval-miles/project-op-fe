import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Alert,
  Collapse,
  Tooltip,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useDebounce } from "../../hooks/useDebounce";
import axiosClient from "../../utils/axiosClient";
import PasswordFields from "./PasswordFields";

const emailValidator =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const passwordValidator = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const CreateUserForm = ({ handleOpenSnackBar, setShowLogin }) => {
  const [input, setInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    emailValid: true,
    passwordValid: true,
    showPassword: false,
    passwordsMatch: true,
    showError: false,
    errorMessage: "",
  });
  const { mutate: createUser } = useMutation(
    async (userData) => (await axiosClient.post("/auth/signup", userData)).data,
    {
      onSuccess: () => {
        handleOpenSnackBar(true);
        setShowLogin(true);
      },
      onError: ({
        response: {
          data: { message },
        },
      }) => {
        setInput((state) => ({
          ...state,
          showError: true,
          errorMessage: message,
        }));
      },
    }
  );
  const { data: emailExists, refetch } = useQuery(
    ["userExists"],
    async () =>
      (await axiosClient.get(`/auth/checkemail?email="${input.email}"`)).data,
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  const checkEmail = useDebounce(() => refetch(), 500);
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (
      !input.username ||
      !input.password ||
      !input.email ||
      !input.emailValid ||
      !input.passwordValid ||
      !input.passwordsMatch ||
      emailExists
    ) {
      setInput((state) => ({
        ...state,
        showError: true,
        errorMessage: "Please provide valid inputs",
      }));
      return;
    }
    createUser({
      username: input.username,
      email: input.email,
      password: input.password,
    });
  };
  const handleChange = (field) => (e) => {
    if (field === "email") {
      setInput({
        ...input,
        email: e.target.value,
        emailValid: emailValidator.test(e.target.value),
        showError: false,
      });
      checkEmail();
    } else if (field === "username")
      setInput({
        ...input,
        username: e.target.value,
        showError: false,
      });
    else if (field === "password")
      setInput({
        ...input,
        password: e.target.value,
        passwordValid: passwordValidator.test(e.target.value),
        showError: false,
      });
    else if (field === "confirmPassword")
      setInput({
        ...input,
        confirmPassword: e.target.value,
        passwordsMatch: input.password === e.target.value,
        showError: false,
      });
    else setInput({ ...input, field: e.target.value });
  };
  return (
    <Box component="form" onSubmit={(e) => handleCreateUser(e)}>
      <Stack gap={3}>
        <Stack gap={1}>
          <TextField
            required
            label="User Name"
            value={input.username}
            style={{ minHeight: "80px" }}
            onChange={handleChange("username")}
          />
          <TextField
            error={!input.emailValid && !!input.email}
            required
            label="Email"
            style={{ minHeight: "80px" }}
            value={input.email}
            onChange={handleChange("email")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {input.email ? (
                    !emailExists && input.emailValid ? (
                      <DoneIcon color="success" />
                    ) : (
                      <Tooltip title="Email already in use">
                        <CloseIcon color="error" />
                      </Tooltip>
                    )
                  ) : (
                    <></>
                  )}
                </InputAdornment>
              ),
            }}
          ></TextField>
          <PasswordFields
            input={input}
            setInput={setInput}
            handleChange={handleChange}
            required
          />
          <Collapse in={input.showError}>
            <Alert severity="error">{input.errorMessage}</Alert>
          </Collapse>
          <Button
            type="submit"
            className="btnHome"
            variant="contained"
            sx={{ bgcolor: "blueviolet" }}
          >
            Create Account
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
