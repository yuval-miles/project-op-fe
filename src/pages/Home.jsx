import React, { useCallback, useEffect, useState } from "react";
import "./Home.css";
import NavBar from "../components/NavBar";
import CheckIcon from "@mui/icons-material/Check";
// import CloseIcon from '@mui/icons-material/Close';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import ThumbDownIcon from '@mui/icons-material/ThumbDown';
// import { FaPoo } from 'react-icons/fa';
import { Box } from "@mui/system";
import { Button, Typography } from "@mui/material";

export default function Home() {
  const iconDislike = ["❌", "👎🏽", "💩"];
  const iconLike = [
    <CheckIcon sx={{ color: "#48B117", fontSize: "7rem" }} />,
    "👍🏼",
    "🔥",
  ];

  const [flip1, setFlip1] = useState("❌");
  const [flip2, setFlip2] = useState(<CheckIcon sx={{ color: "#48B117", fontSize: "7rem" }} />);

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
          variant="outlined"
          size="large"
          sx={{ color: "black", borderColor: "black" }}
        >
          Create an acount
        </Button>
      </Box>
    </>
  );
}
