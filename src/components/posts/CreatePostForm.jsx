import React, { useState } from "react";
import "../../pages/Feed.css";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { useMutation } from "@tanstack/react-query";
import { Button, Typography } from "@mui/material";
import axiosClient from "../../utils/axiosClient";
import { Box } from "@mui/system";
import { useAuth } from "../../hooks/useAuth";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

export default function CreatePostForm() {
  const { token } = useAuth();

  const [post, setPost] = useState({ text: "", userId: "" });

  const { mutate: createPost } = useMutation(
    async (postData) =>
      (await axiosClient.post("/posts/createPost", postData)).data
  );

  const handlePost = (e) => {
    e.preventDefault();
    createPost({
      text: post.text,
      userId: token.id,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handlePost}
      className="postForm"
      sx={{
        width: "50%",
        borderRadius: "10px",
        mx: "auto",
        p: "1rem",
        mt: "2rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TextareaAutosize
        aria-label="minimum height"
        minRows={3}
        placeholder="Ask something..."
        style={{
          padding: "1rem",
          width: "100%",
          resize: "none",
          border: "2px dashed black",
          borderRadius: "10px",
        }}
        onChange={(e) => setPost({ ...post, text: e.target.value })}
      />
      <Box
        sx={{
          padding: "1rem",
          mb: "1.5rem",
          mt:"1rem",
          width: "100%",
          resize: "none",
          border: "2px dashed black",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>Add a Photo to your question?</Typography>
        <input hidden accept="image/*" type="file" />
        <PhotoCamera />
      </Box>
      <Button
      className="btn"
        variant="outlined"
        type="submit"
        sx={{ width: "10%", ml: "auto", color: "black", borderColor:"black"}}
      >
        Add
      </Button>
    </Box>
  );
}
