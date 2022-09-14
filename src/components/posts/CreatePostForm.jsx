import React, { useState } from "react";
import "../../pages/Feed.css";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { useMutation } from "@tanstack/react-query";
import { Button, Typography, Collapse, LinearProgress } from "@mui/material";
import axiosClient from "../../utils/axiosClient";
import { Box } from "@mui/system";
import { useAuth } from "../../hooks/useAuth";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useS3Upload } from "../../hooks/useS3Upload";
import { v4 as uuid } from "uuid";
import { useEffect } from "react";

export default function CreatePostForm() {
  const [postId, setPostId] = useState("");
  const [currImg, setCurrImg] = useState();
  const { token } = useAuth();

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
        id: data.postId,
        picture: uploadUrl.response,
      };
    },
    "Post uploaded!",
    null
  );

  const { mutate: createPost } = useMutation(
    async (postData) =>
      (await axiosClient.post("/posts/createPost", postData)).data
  );

  const handlePost = (e) => {
    e.preventDefault();
    setPostId(uuid());
  };

  useEffect(() => {
    if (postId) s3Upload();
  }, [postId]);

  return (
    <Box
      component="form"
      onSubmit={handlePost}
      sx={{
        width: "50%",
        borderRadius: "5px",
        mx: "auto",
        p: "1rem",
        mt: "2rem",
        display: "flex",
        flexDirection: "column",
        border: "solid red 1px",
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
        variant="contained"
        type="submit"
        sx={{ width: "10%", ml: "auto" }}
      >
        Add
      </Button>
    </Box>
  );
}
