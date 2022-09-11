import { Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { io } from "socket.io-client";
import { useEffect } from "react";

function App() {
  const { isLoading, token } = useAuth();
  useEffect(() => {
    if (token) {
      const socket = new io("http://localhost:3000", {
        extraHeaders: {
          Authentication: `Bearer ${token.raw}`,
        },
      });
      socket.emit("message", "hello");
    }
  }, [token]);
  if (isLoading) return <div></div>;
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
