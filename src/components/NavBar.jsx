import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from './Menu';
import {LoginModal} from "../components/login/LoginModal";

export default function NavBar() {

  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box sx={{ flexGrow: 1  }}>
      <AppBar className='appbar' position="static" sx={{boxShadow:"0px 0px 0px 0px" }}>
        <Toolbar>
        {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Menu />
       </Typography> */}
          <Button onClick={handleOpenModal} sx={{ boxShadow:"0px 0px 0px 0px", color: 'black', ml:"auto" }}>Login</Button>
          <LoginModal openModal={openModal} handleCloseModal={handleCloseModal} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}