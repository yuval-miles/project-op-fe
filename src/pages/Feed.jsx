import { Box } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import CreatePostForm from "../components/posts/CreatePostForm";
import PostsList from "../components/posts/PostsList";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";

const Feed = () => {
  const [postsList, setPostsList] = useState([]);

  const {} = useQuery(
    ["posts"],
    async () => (
      await axiosClient.get("/posts/getAllPosts")).data,
      {
        onSuccess: (data) => {
          setPostsList(data.response);
          console.log('test');
        },
        refetchOnWindowFocus:false
        // refetchInterval: 5000,
      }
  );

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end", mx: "2rem" }}>
        <Button
          align="center"
          variant="outlined"
          size="large"
          sx={{ color: "black", borderColor: "black" }}
        >
          <AddIcon sx={{ mr: "0.3rem" }} /> Add a Post
        </Button>
      </Box>
      <CreatePostForm />
      <PostsList postsList={postsList} />
    </>
  );
}; 

export default Feed;
