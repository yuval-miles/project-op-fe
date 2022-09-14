import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Alert,
  Collapse,
  Tooltip,
  Typography,
  Stack,
  LinearProgress,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import PasswordFields from "../components/login/PasswordFields";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { useDebounce } from "../hooks/useDebounce";
import Snackbar from "@mui/material/Snackbar";
import { useEffect } from "react";
import { useUserData } from "../store/useUserData";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useS3Upload } from "../hooks/useS3Upload";

const emailValidator =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const passwordValidator = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const ProfileSettings = () => {
  const { token, refetchAuth } = useAuth();
  const userData = useUserData((state) => state.userData);
  const [currImg, setCurrImg] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
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
  const { s3Upload, progress } = useS3Upload(
    userData?.id,
    "userphoto/",
    currImg,
    `/users/${userData?.id}`,
    "post",
    {},
    (data, uploadUrl) => {
      return { picture: uploadUrl?.response.split("?")[0] };
    },
    "Picture uploaded",
    null
  );
  useEffect(() => {
    if (currImg) s3Upload();
  }, [currImg]);
  const { mutate: updateUser } = useMutation(
    async (userData) =>
      (await axiosClient.post(`/users/${token.id}`, userData)).data,
    {
      onSuccess: () => {
        handleOpenSnackBar(true);
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

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!token) return;
    if (
      !input.emailValid ||
      !input.passwordValid ||
      !input.passwordsMatch ||
      (emailExists && input.email !== userData.email)
    ) {
      setInput((state) => ({ ...state, showError: true }));
      return;
    }
    const updateObj = {};
    if (input.username !== userData.username)
      updateObj.username = input.username;
    if (input.email !== userData.email) updateObj.email = input.email;
    if (input.password) updateObj.password = input.password;
    if (Object.keys(updateObj).length) {
      updateUser({
        ...updateObj,
      });
    }
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

  const handleOpenSnackBar = () => setOpenSnackBar(true);
  const handleCloseSnackBar = () => setOpenSnackBar(false);

  useEffect(() => {
    if (userData)
      setInput((state) => ({
        ...state,
        username: userData.username,
        email: userData.email,
      }));
  }, [userData]);

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: "2rem" }}>
        Update my profile
      </Typography>
      <Box
        component="form"
        onSubmit={(e) => handleUpdateUser(e)}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mt: "2rem",
          mx: "20%",
          borderRadius: "10px",
          p: "5rem",
          boxShadow: 5,
          gap: 3,
        }}
      >
        <Stack direction={"row"} gap={4} alignItems={"baseline"}>
          {userData?.picture ? (
            <>
              <img
                src={userData.picture}
                style={{ width: "5rem", height: "5rem", borderRadius: "50%" }}
              />
            </>
          ) : (
            <>
              <AccountCircleIcon sx={{ fontSize: "5rem", color: "white" }} />
            </>
          )}
          <Button className="btn" component="label" variant="outlined" sx={{color:"black", border:"black 1px solid"}}>
            <Typography>Add a profile picture</Typography>
            <input
              type="file"
              hidden
              accept="image/png, image/jpeg"
              onChange={(e) => {
                if (e.target.files?.[0]) setCurrImg(e.target.files?.[0]);
              }}
            />
          </Button>
        </Stack>
        <Collapse in={progress.show} sx={{ width: "100%" }}>
          <LinearProgress variant="determinate" value={progress.value} />
        </Collapse>
        <TextField
          label="User Name"
          value={input.username}
          style={{ minHeight: "80px" }}
          onChange={handleChange("username")}
        />
        <TextField
          error={!input.emailValid && !!input.email}
          label="Email"
          style={{ minHeight: "80px" }}
          value={input.email}
          onChange={handleChange("email")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {input.email ? (
                  (!emailExists && input.emailValid) ||
                  input.email === userData.email ? (
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
        />
        <PasswordFields
          input={input}
          setInput={setInput}
          handleChange={handleChange}
        />
        <Collapse in={input.showError}>
          <Alert severity="error">{input.errorMessage}</Alert>
        </Collapse>
        <Button
          className="btn"
          variant="outlined"
          type="submit"
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
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Profile successfully updated!
        </Alert>
      </Snackbar>
    </>
  );
};
