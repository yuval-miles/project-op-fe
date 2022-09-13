import { Box, Button, Stack } from "@mui/material";
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
import { useEffect } from "react";

const Post = ({ text, postId, initLikes, initDislikes }) => {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(initLikes.length);
  const [disLikes, setDisLikes] = useState(initDislikes.length);
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
        type: "disLike",
        postId,
      });
  };
  useEffect(() => {
    socket.on(postId, ({ action }) => {
      console.log(action);
      switch (action) {
        case "removeLike":
          setLikes((state) => state - 1);
          break;
        case "addLike":
          setLikes((state) => state + 1);
          break;
        case "removeDislike":
          setDisLikes((state) => state - 1);
          break;
        case "addDislike":
          setDisLikes((state) => state + 1);
          break;
        case "addLike&&removeDislike":
          setLikes((state) => state + 1);
          setDisLikes((state) => state - 1);
          break;
        case "addDislike&&removeLike":
          setDisLikes((state) => state + 1);
          setLikes((state) => state - 1);

          break;
        default:
          break;
      }
    });
    return () => {
      socket.off(postId);
    };
  }, []);
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
        <Card sx={{ width: "50%", p:"1rem" }}>
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
            <Stack direction={"row"} gap={2}>
              <Button onClick={handleLike}>
                <FavoriteBorderIcon sx={{ color: "green" }} />
              </Button>
              <Typography>{likes}</Typography>
            </Stack>
            <Stack direction={"row"} gap={2}>
              <Button onClick={handleDisLike}>
                <NotInterestedIcon sx={{ color: "red" }} />
              </Button>
              <Typography>{disLikes}</Typography>
            </Stack>
          </Box>

          <Button
            sx={{ display: "flex", ml: "auto" , border:"none"}}
            onClick={() => setShowComments((state) => !state)}
            aria-expanded={showComments}
          >
            <CommentIcon className="menuIcon" sx={{color:"black"}}/>
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
