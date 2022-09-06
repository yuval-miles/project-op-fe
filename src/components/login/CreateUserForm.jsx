import React, { useState, useEffect } from "react";
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
const phoneNumberValidator =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

export const CreateUserForm = () => {
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    emailValid: true,
    passwordValid: true,
    showPassword: false,
    passwordsMatch: true,
    phoneNumber: "",
    phoneNumberValid: true,
    showError: false,
  });
  //TODO: Update create user endpoint
  const { mutate: createUser, isSuccess } = useMutation((userData) =>
    axiosClient.post("/users/createuser", userData)
  );
  const { data: isUserValid, refetch } = useQuery(
    ["userExists"],
    async () =>
      (await axiosClient.get(`/users/userexists?email=${input.email}`)).data,
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  useEffect(() => {
    //TODO: Redirect to home page
  }, [isSuccess]);
  //TODO: Make user exists
  //const getIsUserValid = useDebounce(() => refetch(), 500);
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (
      !input.firstName ||
      !input.lastName ||
      !input.password ||
      !input.email ||
      !input.emailValid ||
      !input.passwordValid ||
      !input.passwordsMatch ||
      !input.phoneNumberValid ||
      !input.phoneNumber ||
      (typeof isUserValid?.response !== "string" &&
        isUserValid?.response.emailExists)
    ) {
      setInput((state) => ({ ...state, showError: true }));
      return;
    }
    createUser({
      firstName: input.firstName,
      lastName: input.lastName,
      phoneNumber: input.phoneNumber,
      email: input.email,
      password: input.password,
    });
  };
  const handleChange = (field) => (e) => {
    if (field === "email" && e.target.value) {
      setInput({
        ...input,
        email: e.target.value,
        emailValid: emailValidator.test(e.target.value),
        showError: false,
      });
      getIsUserValid();
    } else if (field === "firstName" && e.target.value)
      setInput({
        ...input,
        firstName: e.target.value,
        showError: false,
      });
    else if (field === "lastName" && e.target.value)
      setInput({
        ...input,
        lastName: e.target.value,
        showError: false,
      });
    else if (field === "phoneNumber" && e.target.value)
      setInput({
        ...input,
        phoneNumber: e.target.value,
        phoneNumberValid: phoneNumberValidator.test(e.target.value),
        showError: false,
      });
    else if (field === "password" && e.target.value)
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
        <Stack gap={1} style={{ minWidth: "400px" }}>
          <TextField
            required
            label="First Name"
            value={input.firstName}
            style={{ minHeight: "80px" }}
            onChange={handleChange("firstName")}
          />
          <TextField
            required
            label="Last Name"
            value={input.lastName}
            style={{ minHeight: "80px" }}
            onChange={handleChange("lastName")}
          />
          <TextField
            required
            label="Phone number"
            value={input.phoneNumber}
            error={!input.phoneNumberValid && input.phoneNumber !== ""}
            helperText={
              !input.phoneNumberValid && input.phoneNumber !== ""
                ? "Please enter a valid phone number"
                : ""
            }
            style={{ minHeight: "80px" }}
            onChange={handleChange("phoneNumber")}
          />
          <TextField
            error={!input.emailValid}
            required
            label="Email"
            style={{ minHeight: "80px" }}
            value={input.email}
            onChange={handleChange("email")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {input.email && typeof isUserValid?.response !== "string" ? (
                    (!isUserValid?.response.emailExists && input.emailValid) ||
                    input.email === userData?.email ? (
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
          />
          <Collapse in={input.showError}>
            <Alert severity="error">Please provide valid information</Alert>
          </Collapse>
          <Button type="submit" variant="contained">
            Create Account
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
