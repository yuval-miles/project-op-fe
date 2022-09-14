import React, { useState } from "react";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import "../../pages/Feed.css";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { useSocket } from "../../store/useSocket";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../utils/axiosClient";
import { DateTime } from "luxon";

export default function AddCommentForm({ userId, postId }) {
  console.log(postId);
  const socket = useSocket((state) => state.socket);
  const [input, setInput] = useState("");
  const [comments, setComments] = useState([]);
  const { isLoading } = useQuery(
    [`${postId}Comments`],
    async () => (await axiosClient.get(`/posts/${postId}/getcomments`)).data,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setComments(data.comments);
      },
    }
  );
  const handleAddComment = () => {
    socket.emit("commentEvent", {
      userId,
      postId,
      message: input,
      action: "create",
    });
  };
  useEffect(() => {
    socket.on(postId, (data) => {
      console.log(data);
    });
  }, []);
  console.log(comments);
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TextareaAutosize
        aria-label="minimum height"
        minRows={3}
        placeholder="comment..."
        style={{ width: "100%", border: "none", resize: "none" }}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        className="btn"
        variant="outlined"
        type="submit"
        sx={{ width: "10%", ml: "auto", color: "black", borderColor: "black" }}
        onClick={handleAddComment}
      >
        Add
      </Button>
      {comments ? (
        <>
          <Stack sx={{ overflowY: "auto" }}>
            <Stack
              sx={{
                padding: "10px",
                gap: "5px",
                overflowY: "auto",
                flexDirection: "column-reverse",
              }}
            >
              {comments.map((el, idx, arr) => (
                <Stack key={el.id} gap={1}>
                  {idx === arr.length - 1 ? (
                    <Chip
                      sx={{ width: "fit-content", alignSelf: "center" }}
                      label={`${DateTime.fromISO(el.createdAt).monthLong} ${
                        DateTime.fromISO(el.createdAt).day
                      }`}
                    />
                  ) : DateTime.fromISO(arr[idx + 1]?.createdAt).day !==
                    DateTime.fromISO(arr[idx].createdAt).day ? (
                    <>
                      <Chip
                        sx={{ width: "fit-content", alignSelf: "center" }}
                        label={`${
                          DateTime.fromISO(arr[idx]?.createdAt).monthLong
                        } ${DateTime.fromISO(arr[idx]?.createdAt).day}`}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  <Box
                    sx={{
                      backgroundColor:
                        el.userId === userId ? "#067ffe" : "#e5e5ea",
                      color: el.userId === userId ? "white" : "black",
                      padding: "8px",
                      borderRadius: "5px",
                      width: "fit-content",
                      alignSelf:
                        el.userId === userId ? "flex-end" : "flex-start",
                    }}
                  >
                    <Stack direction={"row"} gap={1}>
                      <Stack>
                        <Typography>{el.userName}</Typography>
                        <Typography sx={{ wordBreak: "break-word" }}>
                          {el.message}
                        </Typography>
                      </Stack>
                      <Stack justifyContent={"flex-end"}>
                        {DateTime.fromISO(el.createdAt).toFormat("HH:mm")}
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}
