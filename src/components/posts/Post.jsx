import { Box, Button } from "@mui/material";
import { useState } from "react";
import { useSocket } from "../../store/useSocket";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import CommentIcon from "@mui/icons-material/Comment";
import AddCommentForm from "./AddCommentForm";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { useUserData } from "../../store/useUserData";

const Post = ({ text, postId }) => {
  const [showComments, setShowComments] = useState(false);
  const socket = useSocket((state) => state.socket);
  const userData = useUserData((state) => state.userData);
  const handleLike = () => {
    if (userData)
      socket.emit("likeEvent", { userId: userData.id, type: "like", postId });
  };
  const handleDisLike = () => {
    if (userData)
      socket.emit("likeEvent", {
        userId: userData.id,
        type: "dislike",
        postId,
      });
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "2rem",
          width: "100%",
        }}
      >
        <Card sx={{ width: "50%" }}>
          <CardContent>
            <Typography align="center" variant="h5" component="div">
              {text}
            </Typography>
          </CardContent>

          <Box
            sx={{
              px: "2rem",
              mb: "2rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={handleLike}>
              <FavoriteBorderIcon sx={{ color: "green" }} />
            </Button>
            <Button onClick={handleDisLike}>
              <NotInterestedIcon sx={{ color: "red" }} />
            </Button>
          </Box>

          <Button
            sx={{ display: "flex", ml: "auto" }}
            onClick={() => setShowComments((state) => !state)}
            aria-expanded={showComments}
          >
            <CommentIcon />
          </Button>
        </Card>

        <Collapse in={showComments} orientation="horizontal">
          <Card sx={{ height: "100%" }}>
            <CardContent
              sx={{ bgcolor: "white", width: "100%", borderRadius: "5px" }}
            >
              <AddCommentForm />
              comments
            </CardContent>
          </Card>
        </Collapse>
      </Box>
    </>
  );
};

export default Post;
