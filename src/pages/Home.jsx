import React, { useCallback, useEffect, useState } from "react";
import "./Home.css";
import NavBar from "../components/NavBar";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import { Button, Typography } from "@mui/material";
import { LoginModal } from "../components/login/LoginModal";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [isCreateUser, setIsCreateUser] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const iconDislike = [
    <CloseIcon sx={{ color: "red", fontSize: "6rem" }} />,
    "👎🏽",
    "💩",
  ];
  const iconLike = [
    <CheckIcon sx={{ color: "#48B117", fontSize: "6rem" }} />,
    "👍🏼",
    "🔥",
  ];

  const [flip1, setFlip1] = useState(
    <CloseIcon sx={{ color: "red", fontSize: "6rem" }} />
  );
  const [flip2, setFlip2] = useState(
    <CheckIcon sx={{ color: "#48B117", fontSize: "6rem" }} />
  );

  const handleOpenModal = (isCreateUser) => {
    setOpenModal(true);
    setIsCreateUser(isCreateUser);
  };
  const handleCloseModal = () => setOpenModal(false);
  const handleOpenSnackBar = () => setOpenSnackBar(true);
  const handleCloseSnackBar = () => setOpenSnackBar(false);

  const shuffle = useCallback(() => {
    let idx = 0;
    return () => {
      if (idx < 2) {
        idx++;
      } else {
        idx = 0;
      }
      setFlip1(iconDislike[idx]);
      setFlip2(iconLike[idx]);
    };
  }, []);

  useEffect(() => {
    const intervalID = setInterval(shuffle(), 2000);
    return () => clearInterval(intervalID);
  }, [shuffle]);

  return (
    <>
      <NavBar handleOpenModal={handleOpenModal} />
      <Typography mt={10} variant="h3" align="center" sx={{ color: "black" }}>
        What will you decide?
      </Typography>
      <Box sx={{ display: "flex" }}>
        <Box className="icon" align="center">
          {flip1}
        </Box>
        <Box className="icon" align="center">
          {flip2}
        </Box>
      </Box>
      <Box align="center" mt={10}>
        <Button
          onClick={() => handleOpenModal(true)}
          variant="outlined"
          size="large"
          sx={{ color: "black", borderColor: "black" }}
        >
          Create an account
        </Button>
        <LoginModal
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          isCreateUser={isCreateUser}
          handleOpenSnackBar={handleOpenSnackBar}
          setIsCreateUser={setIsCreateUser}
        />
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
          User successfully created!
        </Alert>
      </Snackbar>
    </>
  );
}
