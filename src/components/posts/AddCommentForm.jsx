import React, { useEffect } from 'react'
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { Box, Button } from "@mui/material";
import "../../pages/Feed.css"
import AddCommentIcon from '@mui/icons-material/AddComment';

export default function AddCommentForm() {
  return (
    <Box sx={{ display: "flex", flexDirection:"column"}}>
    <TextareaAutosize
        aria-label="minimum height"
        minRows={3} 
        placeholder="comment..."
        style={{ width: "100%", border: "none",resize: "none"}}
      />
      <Button variant="contained" type="submit" sx={{width:"10%", ml:"auto"}}>
        Add
      </Button>
      </Box>
  )
}
