import { Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useSocket } from "./store/useSocket";

function App() {
  const { isLoading, token } = useAuth();
  const { setSocket, socket } = useSocket((state) => ({
    setSocket: state.setSocket,
    socket: state.socket,
  }));
  useEffect(() => {
    if (token && !socket) {
      const socket = new io("http://localhost:3000", {
        extraHeaders: {
          Authentication: `Bearer ${token.raw}`,
        },
      });
      setSocket(socket);
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
