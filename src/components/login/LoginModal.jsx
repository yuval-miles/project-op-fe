import { Box, Button, Stack, Fade, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CreateUserForm, LoginForm } from ".";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius:"10px"
};

export const LoginModal = ({
  openModal,
  handleCloseModal,
  isCreateUser,
  handleOpenSnackBar,
}) => {
  const [showLogin, setShowLogin] = useState(true);
  const handleClick = () => {
    setShowLogin((state) => !state);
  };
  useEffect(() => {
    if (isCreateUser) setShowLogin(false);
    else setShowLogin(true);
  }, [isCreateUser]);
  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      closeAfterTransition
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Fade in={openModal}>
        <Box sx={style}>
          <Stack gap={3}>
            {showLogin ? (
              <LoginForm handleCloseModal={handleCloseModal} />
            ) : (
              <CreateUserForm
                handleOpenSnackBar={handleOpenSnackBar}
                setShowLogin={setShowLogin}
              />
            )}
            <Button
              variant="text"
              onClick={handleClick}
              sx={{ textTransform: "unset", color:"blueviolet"}}
            >
              {showLogin ? "Dont have an account?" : "Already have an account?"}
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};
