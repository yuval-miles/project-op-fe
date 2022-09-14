import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CreatePostForm from "./CreatePostForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

export default function CreatePostModal({
  openPostModal,
  handleClosePostModal,
  isPosted,
  refetchPosts,
}) {
  return (
    <div>
      <Modal
        open={openPostModal}
        onClose={handleClosePostModal}
        closeAfterTransition
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CreatePostForm
            refetchPosts={refetchPosts}
            handleClosePostModal={handleClosePostModal}
            isPosted={isPosted}
          />
        </Box>
      </Modal>
    </div>
  );
}
