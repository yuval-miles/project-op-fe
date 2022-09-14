import { Box } from "@mui/material";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import PostsList from "../components/posts/PostsList";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../hooks/useAuth";
import CreatePostModal from "../components/posts/CreatePostModal";

const Feed = () => {
  const [openPostModal, setOpenPostModal] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [postsList, setPostsList] = useState([]);
  const [myLikes, setMyLikes] = useState([]);
  const [myDislikes, setMyDislikes] = useState([]);
  const { logout } = useAuth();
  const { refetch: refetchPosts } = useQuery(
    ["posts"],
    async () => (await axiosClient.get("/posts")).data,
    {
      onSuccess: (data) => {
        console.log(data.response);
        setPostsList(data.response.posts);
        setMyLikes(data.response.myLikesObj);
        setMyDislikes(data.response.myDislikesObj);
      },
      refetchOnWindowFocus: false,
    }
  );

  const handleOpenPostModal = (isPosted) => {
    setOpenPostModal(true);
    setIsPosted(true);
  };
  const handleClosePostModal = () => setOpenPostModal(false);
  return (
    <>
      <Button
        className="btn"
        onClick={() => handleOpenPostModal(true)}
        variant="outlined"
        size="large"
        sx={{ color: "black", borderColor: "black", mt: "5rem" }}
      >
        Add a post
      </Button>
      <CreatePostModal
        openPostModal={openPostModal}
        handleClosePostModal={handleClosePostModal}
        isPosted={isPosted}
        refetchPosts={refetchPosts}
      />
      <PostsList
        postsList={postsList}
        myLikes={myLikes}
        myDislikes={myDislikes}
      />
    </>
  );
};

export default Feed;
