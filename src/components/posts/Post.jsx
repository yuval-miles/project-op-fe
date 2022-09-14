import { Box, Button, Stack } from "@mui/material";
import "../../pages/Feed.css";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { DateTime } from "luxon";
import Divider from "@mui/material/Divider";

const Post = ({
  text,
  postId,
  initLikes,
  initDislikes,
  liked,
  disliked,
  picture,
  postUser,
  createdAt,
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
        <Card
          sx={{
            p: "1rem",
            borderRadius: "10px",
            bgcolor: "rgba(242,99,170, 0.1)",
            width: "50%",
          }}
        >
          <Stack
            direction={"row"}
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Stack direction={"row"} gap={2} alignItems={"center"}>
              {postUser.picture ? (
                <>
                  <img
                    src={postUser.picture}
                    style={{
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "50%",
                    }}
                  />
                </>
              ) : (
                <>
                  <AccountCircleIcon
                    style={{ width: "3rem", height: "3rem", color: "white" }}
                  />
                </>
              )}
              <Typography>{postUser.username}</Typography>
            </Stack>
            <Typography>
              {DateTime.fromISO(createdAt).toFormat("DD HH:mm")}
            </Typography>
          </Stack>
          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />
          {picture ? (
            <Typography
              align="center"
              variant="h5"
              component="div"
              sx={{ mb: "1rem" }}
            >
              {text}
            </Typography>
          ) : (
            ""
          )}

          <Box
            sx={{
              mb: "1rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
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
                  <FavoriteBorderIcon
                    sx={{ color: "black", fontSize: "3rem" }}
                  />
                ) : (
                  <FavoriteIcon sx={{ color: "red", fontSize: "3rem" }} />
                )}
              </Button>
              <Typography>{likes.num}</Typography>
            </Box>
            <Box>
              {picture ? (
                <Box className="photo">
                  {" "}
                  <img src={picture} />
                </Box>
              ) : (
                <Typography
                  align="center"
                  variant="h5"
                  component="div"
                  sx={{ mb: "1rem" }}
                >
                  {text}
                </Typography>
              )}
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
                  <NotInterestedIcon
                    sx={{ color: "black", fontSize: "3rem" }}
                  />
                ) : (
                  <NotInterestedIcon sx={{ color: "red", fontSize: "3rem" }} />
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
            <CommentIcon sx={{ color: "blueviolet", fontSize: "2rem" }} />
          </Button>
        </Card>

        <Collapse
          in={showComments}
          sx={{ border: "3px solid blue" }}
          orientation="horizontal"
          unmountOnExit
        >
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ height: "100%", borderRadius: "5px" }}>
              <AddCommentForm
                userId={userData.id}
                postId={postId}
                username={userData.username}
              />
            </CardContent>
          </Card>
        </Collapse>
      </Box>
    </>
  );
};

export default Post;
