import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";

export default function NavBar({ handleOpenModal }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        className="appbar"
        position="static"
        sx={{ boxShadow: "0px 0px 0px 0px" }}
      >
        <Toolbar>
          <Button
            className="btn"
            onClick={() => handleOpenModal(false)}
            sx={{
              color: "black",
              ml: "auto",
              border: "1px solid black",
              px: "1rem",
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
