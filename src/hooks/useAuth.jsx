import { useQuery } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorAlert, setErrorAlert] = useState({ show: false, message: "" });
  const { isLoading: authLoading, data: token } = useQuery(
    ["auth"],
    async () => (await axiosClient.get("/auth")).data,
    {
      cacheTime: 0,
      retry: false,
      onSuccess: (data) => {
        if (!data) navigate("/");
        else if (location.pathname === "/") navigate("/feed");
      },
      onError: (error) => {
        if (error.response.data)
          setErrorAlert({ show: true, message: error.response.data.message });
        else
          setErrorAlert({
            show: true,
            message: "Ooops an error has occurred please try again later",
          });
      },
    }
  );
  const { refetch: logout, isLoading: logoutLoading } = useQuery(
    ["logout"],
    async () => (await axiosClient.get("/auth/signout")).data,
    {
      cacheTime: 0,
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: () => {
        navigate("/");
      },
      onError: (error) => {
        if (error.response.data)
          setErrorAlert({ show: true, message: error.response.data.message });
        else
          setErrorAlert({
            show: true,
            message: "Ooops an error has occurred please try again later",
          });
      },
    }
  );
  const closeErrorAlert = () => setErrorAlert({ show: false, message: "" });
  return {
    token,
    authLoading,
    logoutLoading,
    logout,
    errorAlert,
    closeErrorAlert,
  };
};
