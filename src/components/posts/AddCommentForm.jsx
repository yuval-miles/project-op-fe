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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function AddCommentForm({ userId, postId, username }) {
  const socket = useSocket((state) => state.socket);
  const [input, setInput] = useState("");
  const [comments, setComments] = useState([]);
  const { isLoading } = useQuery(
    [`${postId}Comments`],

    async () => (await axiosClient.get(`/posts/getcomments/${postId}`)).data,
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
    socket.on(`${postId}comment`, (data) => {
      setComments((state) => [data.action, ...state]);
    });
    return () => {
      socket.off(`${postId}comment`);
    };
  }, []);
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {comments ? (
        <>
          <Stack sx={{ overflowY: "auto", height: "280px" }}>
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
                        <Stack direction={"row"} gap={1}>
                          {el?.user?.picture ? (
                            <>
                              <img
                                src={el?.user?.picture}
                                style={{
                                  width: "1rem",
                                  height: "1rem",
                                  borderRadius: "50%",
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <AccountCircleIcon
                                style={{
                                  width: "1rem",
                                  height: "1rem",
                                  color: "white",
                                }}
                              />
                            </>
                          )}
                          <Typography>{el?.user?.username}</Typography>
                        </Stack>
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

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={3}
          placeholder="comment..."
          value={input}
          style={{ width: "100%", border: "none", resize: "none" }}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          className="btn"
          variant="outlined"
          type="submit"
          sx={{
            width: "10%",
            ml: "auto",
            color: "black",
            borderColor: "black",
          }}
          onClick={() => {
            handleAddComment();
            setInput("");
          }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}
