import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Box, Button, TextField } from "@mui/material";
import PasswordFields from "../components/login/PasswordFields";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { useDebounce } from "../hooks/useDebounce";
import { useParams } from "react-router-dom";
const emailValidator =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const passwordValidator = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const ProfileSettings = () => {
  const { token } = useAuth();
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
  const { mutate: updateUser } = useMutation(
    async (userData) =>
      (await axiosClient.post(`/users/${token.id}`, userData)).data,
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

  const handleUpdatedUser = (e) => {
    e.preventDefault();
    updateUser({
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
    <>
      <Box
        component="form"
        onSubmit={(e) => handleUpdatedUser(e)}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mt: "5rem",
          mx: "30%",
        }}
      >
        <TextField
          label="User Name"
          value={input.username}
          style={{ minHeight: "80px" }}
          onChange={handleChange("username")}
        />
        <TextField
          label="Email"
          style={{ minHeight: "80px" }}
          value={input.email}
          onChange={handleChange("email")}
        />
           {/* <TextField
          required
          type="password"
          label="Previous password"
          style={{ minHeight: "80px" }}
        /> */}
        <PasswordFields
          input={input}
          setInput={setInput}
          handleChange={handleChange}
        />
        <Button
          variant="outlined"
          type="submit"
          size="small"
          sx={{
            color: "black",
            borderColor: "black",
            border: "1px solid black",
            alignSelf: "flex-end",
          }}
        >
          Save changes
        </Button>
      </Box>
    </>
  );
};