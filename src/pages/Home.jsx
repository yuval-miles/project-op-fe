import { LoginModal } from "../components/login";
import { Button } from "@mui/material";
import React from "react";

const Home = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  return (
    <>
      <Button onClick={handleOpenModal}>Open Modal</Button>
      <LoginModal openModal={openModal} handleCloseModal={handleCloseModal} />
    </>
  );
};
export default Home;
