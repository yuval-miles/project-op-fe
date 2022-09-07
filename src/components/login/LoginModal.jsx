import { Box, Button, Stack, Fade, Modal } from "@mui/material";
import React, { useState } from "react";
import { CreateUserForm, LoginForm } from ".";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const LoginModal = ({ openModal, handleCloseModal }) => {
  const [showLogin, setShowLogin] = useState(true);
  const handleClick = () => {
    setShowLogin((state) => !state);
  };
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
              <CreateUserForm handleCloseModal={handleCloseModal} />
            )}
            <Button
              variant="text"
              onClick={handleClick}
              sx={{ textTransform: "unset" }}
            >
              {showLogin ? "Dont have an account?" : "Already have an account?"}
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};
