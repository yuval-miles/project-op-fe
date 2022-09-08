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
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Menu />
       </Typography> */}
          <Button
            onClick={() => handleOpenModal(false)}
            sx={{ boxShadow: "0px 0px 0px 0px", color: "black", ml: "auto" }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
