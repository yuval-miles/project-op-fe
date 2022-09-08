import { Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isLoading } = useAuth();
  if (isLoading) return <div></div>;
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
