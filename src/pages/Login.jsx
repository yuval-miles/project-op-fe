import { Box, Button, Stack } from "@mui/material";
import React, { useState } from "react";
import { CreateUserForm, LoginForm } from "../components/login";

const Login = () => {
  const [showLogin, setShowLogin] = useState(true);
  const handleClick = () => {
    setShowLogin((state) => !state);
  };
  return (
    <Box>
      <Stack gap={3}>
        {showLogin ? <LoginForm /> : <CreateUserForm />}
        <Button
          variant="text"
          onClick={handleClick}
          sx={{ textTransform: "unset" }}
        >
          {showLogin ? "Dont have an account?" : "Already have an account?"}
        </Button>
      </Stack>
    </Box>
  );
};

export default Login;
