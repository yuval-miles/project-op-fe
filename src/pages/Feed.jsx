import { Box } from "@mui/material";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import CreatePostForm from "../components/posts/CreatePostForm";
import PostsList from "../components/posts/PostsList";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../hooks/useAuth";

const Feed = () => {
  const [postsList, setPostsList] = useState([]);
  const [myLikes, setMyLikes] = useState([]);
  const { logout } = useAuth();
  const {} = useQuery(
    ["posts"],
    async () => (await axiosClient.get("/posts")).data,
    {
      onSuccess: (data) => {
        setPostsList(data.response.posts);
        setMyLikes(data.response.myLikesObj);
      },
      refetchOnWindowFocus: false,
      // refetchInterval: 5000,
    }
  );
  return (
    <>
      <CreatePostForm />
      <PostsList postsList={postsList} myLikes={myLikes} />
    </>
  );
};

export default Feed;
