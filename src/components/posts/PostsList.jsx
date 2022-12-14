import { Box } from "@mui/material";
import React, { useState } from "react";
import Post from "./Post";

export default function PostsList({ postsList, myLikes, myDislikes }) {
  return (
    <>
      <Box
        className="cardBox"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: "2rem",
        }}
      >
        {postsList.map((post) => (
          <Post
            key={post.id}
            text={post.text}
            postId={post.id}
            initLikes={post.likes}
            initDislikes={post.dislikes}
            liked={!!myLikes[post.id]}
            disliked={!!myDislikes[post.id]}
            picture={post.picture}
            postUser={post.user}
            createdAt={post.createdAt}
          />
        ))}
      </Box>
    </>
  );
}
