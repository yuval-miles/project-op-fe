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
import FavoriteIcon from "@mui/icons-material/Favorite";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { useUserData } from "../../store/useUserData";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../utils/axiosClient";

const Post = ({
  text,
  postId,
  initLikes,
  initDislikes,
  liked,
  disliked,
  picture,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState({ num: initLikes.length, enabled: true });
  const [disLikes, setDisLikes] = useState({
    num: initDislikes.length,
    enabled: true,
  });

  const [isLiked, setIsLiked] = useState(liked);
  const [isDisliked, setIsDisliked] = useState(disliked);
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
          setIsLiked(false);
          break;
        case "addLike":
          setLikes((state) => ({ enabled: true, num: state.num + 1 }));
          setIsLiked(true);
          break;
        case "removeDislike":
          setDisLikes((state) => ({ enabled: true, num: state.num - 1 }));
          setIsDisliked(false);
          break;
        case "addDislike":
          setDisLikes((state) => ({ enabled: true, num: state.num + 1 }));
          setIsDisliked(true);
          break;
        case "addLike&&removeDislike":
          setLikes((state) => ({ enabled: true, num: state.num + 1 }));
          setDisLikes((state) => ({ enabled: true, num: state.num - 1 }));
          setIsLiked(true);
          setIsDisliked(false);
          break;
        case "addDislike&&removeLike":
          setLikes((state) => ({ enabled: true, num: state.num - 1 }));
          setDisLikes((state) => ({ enabled: true, num: state.num + 1 }));
          setIsLiked(false);
          setIsDisliked(true);
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
        <Card sx={{ width: "50%", p: "1rem" }}>
          <CardContent>
            <img src={picture} />
            <Typography align="center" variant="h5" component="div">
              {text}
            </Typography>
          </CardContent>

          <Box
            sx={{
              mb: "1rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button onClick={handleLike} disabled={!likes.enabled}>
                {!isLiked ? (
                  <FavoriteBorderIcon sx={{ color: "darkgrey" }} />
                ) : (
                  <FavoriteIcon sx={{ color: "red" }} />
                )}
              </Button>
              <Typography>{likes.num}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button onClick={handleDisLike} disabled={!disLikes.enabled}>
                {!isDisliked ? (
                  <NotInterestedIcon sx={{ color: "darkgrey" }} />
                ) : (
                  <NotInterestedIcon sx={{ color: "red" }} />
                )}
              </Button>
              <Typography>{disLikes.num}</Typography>
            </Box>
          </Box>

          <Button
            sx={{ display: "flex", ml: "auto", border: "none" }}
            onClick={() => setShowComments((state) => !state)}
            aria-expanded={showComments}
          >
            <CommentIcon sx={{ color: "blueviolet" }} />
          </Button>
        </Card>

        <Collapse in={showComments} orientation="horizontal" unmountOnExit>
          <Card sx={{ height: "100%" }}>
            <CardContent
              sx={{ bgcolor: "white", width: "100%", borderRadius: "5px" }}
            >
              <AddCommentForm userId={userData.id} postId={postId} />
            </CardContent>
          </Card>
        </Collapse>
      </Box>
    </>
  );
};

export default Post;
