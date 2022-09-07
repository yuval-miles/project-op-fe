import React, { useCallback, useEffect, useState } from "react";
import "./Home.css";
import NavBar from "../components/NavBar";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from '@mui/icons-material/Close';
import { Box } from "@mui/system";
import { Button, Typography } from "@mui/material";
import {LoginModal} from "../components/login/LoginModal";

export default function Home() {
  const [openModal, setOpenModal] = React.useState(false);
  const iconDislike = [<CloseIcon sx={{ color: "red", fontSize: "6rem"}}/>, "👎🏽", "💩"];
  const iconLike = [
    <CheckIcon sx={{ color: "#48B117", fontSize: "6rem"}} />,
    "👍🏼",
    "🔥",
  ];
  
  const [flip1, setFlip1] = useState(<CloseIcon sx={{ color: "red", fontSize: "6rem"}}/>);
  const [flip2, setFlip2] = useState(<CheckIcon sx={{ color: "#48B117", fontSize: "6rem" }} />);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const shuffle = useCallback(() => {
    let idx = 0;
    return () => {
      if (idx < 2) {
        idx++;
      } else {
        idx = 0
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
      <NavBar />
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
          onClick={handleOpenModal}
          variant="outlined"
          size="large"
          sx={{ color: "black", borderColor: "black" }}
        >
          Create an acount
        </Button>
        <LoginModal openModal={openModal} handleCloseModal={handleCloseModal} />
      </Box>
    </>
  );
}
