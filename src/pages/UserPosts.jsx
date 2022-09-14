import { Box, TextField } from "@mui/material";
import React from "react";
import { useAuth } from "../hooks/useAuth";

export default function UserPosts() {
  const { token } = useAuth();

  return <Box component="form"></Box>;
}
