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

const Post = ({ text, postId, initLikes, initDislikes, liked }) => {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState({ num: initLikes.length, enabled: true });
  const [disLikes, setDisLikes] = useState({
    num: initDislikes.length,
    enabled: true,
  });
  const [isLiked, setIsLiked] = useState(liked);
  const socket = useSocket((state) => state.socket);
  const userData = useUserData((state) => state.userData);

  const handleLike = () => {
    setLikes((state) => ({ ...state, enabled: false }));
    if (userData)
      socket.emit("likeEvent", { userId: userData.id, type: "like", postId });
  };
  const handleDisLike = () => {
    setDisLikes((state) => ({ ...state, enabled: false }));
    if (userData)
      socket.emit("likeEvent", {
        userId: userData.id,
        type: "disLike",
        postId,
      });
  };
  useEffect(() => {
    socket.on(postId, ({ action }) => {
      switch (action) {
        case "removeLike":
          setLikes((state) => ({ enabled: true, num: state.num - 1 }));
          break;
        case "addLike":
          setLikes((state) => ({ enabled: true, num: state.num + 1 }));
          break;
        case "removeDislike":
          setDisLikes((state) => ({ enabled: true, num: state.num - 1 }));
          break;
        case "addDislike":
          setDisLikes((state) => ({ enabled: true, num: state.num + 1 }));
          break;
        case "addLike&&removeDislike":
          setLikes((state) => ({ enabled: true, num: state.num + 1 }));
          setDisLikes((state) => ({ enabled: true, num: state.num - 1 }));
          break;
        case "addDislike&&removeLike":
          setLikes((state) => ({ enabled: true, num: state.num - 1 }));
          setDisLikes((state) => ({ enabled: true, num: state.num + 1 }));
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
              <Button onClick={handleLike} disabled={!likes.enabled}>
                <FavoriteBorderIcon sx={{ color: "green" }} />
              </Button>
              <Typography>{likes.num}</Typography>
            </Stack>
            <Stack direction={"row"} gap={2}>
              <Button onClick={handleDisLike} disabled={!disLikes.enabled}>
                <NotInterestedIcon sx={{ color: "red" }} />
              </Button>
              <Typography>{disLikes.num}</Typography>
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
