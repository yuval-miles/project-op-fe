import React from "react";
import { useAuth } from "../hooks/useAuth";

const Feed = () => {
  const { isLoading } = useAuth();
  return <div>Feed</div>;
};

export default Feed;
