import { Box } from "@mui/material";
import "./Feed.css";
import React from "react";
import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const Feed = () => {
  return(
    <>
    <Box sx={{display:"flex", justifyContent:"end", mx:"2rem"}}>
      <Button
          align="center"
          variant="outlined"
          size="large"
          sx={{ color: "black", borderColor: "black"}}
        >
         <AddIcon sx={{mr:"0.3rem"}}/> Add a Post 
        </Button>
    </Box>
<Box className="cardBox" sx={{display:"flex", justifyContent:"center"}}>
<Card className="cardDisplay">
{/* <CardMedia
  component="img"
  height="140"
  src="./images/test.jpg"
  alt="green iguana"
/> */}
<CardContent>
  <Typography gutterBottom variant="h5" component="div">
    Something
  </Typography>
  {/* <Typography variant="body2" color="text.secondary">
    Lizards are a widespread group of squamate reptiles, with over 6,000
    species, ranging across all continents except Antarctica
  </Typography> */}
</CardContent>
{/* <CardActions>
  <Button size="small">Share</Button>
  <Button size="small">Learn More</Button>
</CardActions> */}
</Card>
</Box>
</>
  ) 
};

export default Feed;
