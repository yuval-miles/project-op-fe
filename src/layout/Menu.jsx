import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import LogoutIcon from "@mui/icons-material/Logout";
import FolderIcon from '@mui/icons-material/Folder';
import { useAuth } from "../hooks/useAuth";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { Opacity } from "@mui/icons-material";

export default function Menu() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{
        height: "100%",
        width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List sx={{ height: "30%" }}>
        <ListItem>
          <ListItemButton onClick={() => navigate("/feed")}>
            <ListItemIcon>
              <DynamicFeedIcon />
            </ListItemIcon>
            <ListItemText> Feed</ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => navigate("/myposts")}>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText>My posts</ListItemText>
          </ListItemButton>
        </ListItem>
        
        <ListItem>
          <ListItemButton onClick={() => navigate("/profilesettings")}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText> Profile settings</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "center", height: "60%" }}>
        <Button
          className="btn"
          variant="outlined"
          size="large"
          sx={{
            color: "black",
            borderColor: "black",
            border: "1px solid black",
            alignSelf: "flex-end",
          }}
          onClick={logout}
        >
          <LogoutIcon sx={{ mr: "0.3rem" }} /> Log out
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)} sx={{ color: "black" }}>
            <MenuIcon className="menuIcon"/>{" "}
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </>
  );
}
