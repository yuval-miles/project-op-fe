import React, { useState } from "react";
import "../../pages/Feed.css";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { Button, Typography, Collapse, LinearProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useAuth } from "../../hooks/useAuth";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useS3Upload } from "../../hooks/useS3Upload";
import { v4 as uuid } from "uuid";
import { useEffect } from "react";
import axiosClient from "../../utils/axiosClient";
import { useMutation } from "@tanstack/react-query";

export default function CreatePostForm({ refetchPosts}) {
  const [postId, setPostId] = useState("");
  const [currImg, setCurrImg] = useState("");
  const { token } = useAuth();

  const { mutateAsync: createPost } = useMutation(
    async (postData) =>
      (await axiosClient.post("/posts/createPost", postData)).data
  );

  const [post, setPost] = useState({ text: "" });
  const { s3Upload, progress } = useS3Upload(
    postId,
    "postimgs/",
    currImg,
    "/posts/createpost",
    "post",
    { post, postId },
    (data, uploadUrl) => {
      return {
        ...data.post,
        userId: token.id,
        username: token.username,
        id: data.postId,
        picture: uploadUrl?.response.split("?")[0],
      };
    },
    "Post uploaded!",
    () => {
      refetchPosts();
      setCurrImg("");
    }
  );

  const handlePost = async (e) => {
    e.preventDefault();
    if (currImg) setPostId(uuid());
    else {
      await createPost({
        text: post.text,
        userId: token.id,
      });
      refetchPosts();
    }
  };

  useEffect(() => {
    if (postId) s3Upload();
  }, [postId]);

  return (
    <Box
      component="form"
      onSubmit={handlePost}
      className="postForm"
      sx={{
        width: "40%",
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
      {!currImg ? (
        <>
          <Box
            sx={{
              padding: "1rem",
              my: "2rem",
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
            <Button component="label">
              <Typography>Add a Photo to your question?</Typography>
              <PhotoCamera />
              <input
                type="file"
                hidden
                accept="image/png, image/jpeg"
                onChange={(e) => {
                  if (e.target.files?.[0]) setCurrImg(e.target.files?.[0]);
                }}
              />
            </Button>
          </Box>
        </>
      ) : (
        <>
          <img src={URL.createObjectURL(currImg)} />
        </>
      )}
      <Collapse in={progress.show} sx={{ width: "100%" }}>
        <LinearProgress variant="determinate" value={progress.value} />
      </Collapse>
      <Button
        className="btn"
        variant="outlined"
        type="submit"
        sx={{ width: "10%", ml: "auto", color: "black", borderColor: "black" }}
      >
        Add
      </Button>
    </Box>
  );
}
