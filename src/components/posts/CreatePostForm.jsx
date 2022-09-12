import React, { useState } from "react";
import "../../pages/Feed.css"
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@mui/material";
import axiosClient from "../../utils/axiosClient";
import { Box } from "@mui/system";
import { useAuth } from "../../hooks/useAuth";

export default function CreatePostForm() {

  const { token } = useAuth();
  
  const [post, setPost] = useState({ text: "", userId: "" });

  const { mutate: createPost } = useMutation(
    async (postData) =>
      (await axiosClient.post("/posts/createPost", postData)).data
  )
 
  const handlePost = (e) => {
    e.preventDefault();
    createPost({
      text: post.text,
      userId: token.id,
    });
  };

  

  return (


    <Box component="form" onSubmit={handlePost} sx={{width:"50%",borderRadius:"5px", mx:"auto",p:"1rem",mt:"2rem",bgcolor:"white", display:"flex" ,flexDirection: "column"}}>
      <TextareaAutosize
        aria-label="minimum height"
        minRows={3}
        placeholder="Ask something..."
        style={{ width: "100%", border: "none",resize: "none"}}
        onChange={(e) => setPost({ ...post, text: e.target.value })}
      />
      <Button variant="contained" type="submit" sx={{width:"10%", ml:"auto"}}>
        Add
      </Button>
    </Box>
   
 
 
  );
}
