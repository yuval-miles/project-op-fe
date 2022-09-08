import { useQuery } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const { isLoading } = useQuery(
    ["auth"],
    async () => (await axiosClient.get("/auth")).data,
    {
      cacheTime: 0,
      retry: false,
      onSuccess: (data) => {
        if (!data) navigate("/");
      },
    }
  );
  return { isLoading };
};
