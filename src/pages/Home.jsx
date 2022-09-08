import React, { useCallback, useEffect, useState } from "react";
import "./Home.css";
import NavBar from "../components/NavBar";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import { Button, Typography } from "@mui/material";
import { LoginModal } from "../components/login/LoginModal";
import { useTransition, animated, config } from "react-spring";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [isCreateUser, setIsCreateUser] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [currIdx, setCurrIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(0);
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
  const transitions = useTransition(toggle, {
    from: { opacity: 0, y: 1 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -1 },
    reverse: toggle,
    config: config.stiff,
  });

  const handleOpenModal = (isCreateUser) => {
    setOpenModal(true);
    setIsCreateUser(isCreateUser);
  };
  const handleCloseModal = () => setOpenModal(false);
  const handleOpenSnackBar = () => setOpenSnackBar(true);
  const handleCloseSnackBar = () => setOpenSnackBar(false);

  const shuffle = useCallback(() => {
    let idx = 0;
    let toggle = true;
    return () => {
      if (idx < 2) idx++;
      else idx = 0;
      if (toggle) setCurrIdx(idx);
      else setNextIdx(idx);
      setToggle((state) => !state);
      toggle = !toggle;
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
        <Box className="icon">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {transitions(({ opacity, y }, item) =>
              item ? (
                <animated.div
                  style={{
                    opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }),
                    transform: y
                      .to({ range: [0.0, 1], output: [0, 200] })
                      .to((y) => `translate3d(0,${y}px,0)`),
                    position: "absolute",
                  }}
                >
                  {iconDislike[currIdx]}
                </animated.div>
              ) : (
                <animated.div
                  style={{
                    opacity: opacity.to({ range: [1.0, 0.0], output: [1, 0] }),
                    transform: y
                      .to({ range: [0.0, 1], output: [0, 200] })
                      .to((y) => `translate3d(0,${y}px,0)`),
                    position: "absolute",
                  }}
                >
                  {iconDislike[nextIdx]}
                </animated.div>
              )
            )}
          </Box>
        </Box>
        <Box className="icon">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {transitions(({ opacity, y }, item) =>
              item ? (
                <animated.div
                  style={{
                    opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }),
                    transform: y
                      .to({ range: [0.0, 1], output: [0, 200] })
                      .to((y) => `translate3d(0,${y}px,0)`),
                    position: "absolute",
                  }}
                >
                  {iconLike[currIdx]}
                </animated.div>
              ) : (
                <animated.div
                  style={{
                    opacity: opacity.to({ range: [1.0, 0.0], output: [1, 0] }),
                    transform: y
                      .to({ range: [0.0, 1], output: [0, 200] })
                      .to((y) => `translate3d(0,${y}px,0)`),
                    position: "absolute",
                  }}
                >
                  {iconLike[nextIdx]}
                </animated.div>
              )
            )}
          </Box>
        </Box>
      </Box>
      <Box align="center" mt={10}>
        <Button
          onClick={() => handleOpenModal(true)}
          variant="outlined"
          size="large"
          sx={{ color: "black", borderColor: "black", mt: "5rem" }}
        >
          Create an account
        </Button>
        <LoginModal
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          isCreateUser={isCreateUser}
          handleOpenSnackBar={handleOpenSnackBar}
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
          Account successfully created!
        </Alert>
      </Snackbar>
    </>
  );
}
