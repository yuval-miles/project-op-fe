import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import CommentIcon from "@mui/icons-material/Comment";
import AddCommentForm from "./AddCommentForm";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NotInterestedIcon from '@mui/icons-material/NotInterested';

export default function PostsList(props) {
  const { postsList } = props;
  const [seeComments, setSeeComments] = useState(false);

   const handleClick = i => {
    setSeeComments(seeComments === i ? false : i);
  }

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
        {postsList.map((post, i) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: "2rem",
              width: "100%",
            }}
            key={post.id}
          >
            <Card sx={{ width: "50%" }}>
              <CardContent>
                <Typography align="center" variant="h5" component="div">
                  {post.text}
                </Typography>
              </CardContent>
              
               <Box sx={{px:"2rem", mb:"2rem", display:"flex", justifyContent: 'space-between'}}>
              <Button><FavoriteBorderIcon sx={{ color:"green"}}/></Button>
              <Button><NotInterestedIcon sx={{ color:"red" }}/></Button>
              </Box>
              
             
              <Button
                sx={{ display: "flex", ml: "auto" }}
                onClick={() =>handleClick(i)}
                aria-expanded={seeComments === i}
              >
                <CommentIcon />
              </Button>
            </Card>

            <Collapse in={seeComments === i} orientation="horizontal">
            <Card sx={{height:"100%"}}>
              <CardContent
                sx={{ bgcolor: "white", width: "100%", borderRadius: "5px" }}
              >
                <AddCommentForm/>
                comments
              </CardContent>
              </Card>
            </Collapse>
          </Box>
        ))}
      </Box>
    </>
  );
}
