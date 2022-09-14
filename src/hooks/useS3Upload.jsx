import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import axiosClient from "../utils/axiosClient";

export const useS3Upload = (
  filePath,
  fileName,
  image,
  apiPath,
  apiMethod,
  data,
  dataCallback,
  alertSuccessMessage,
  completedCallback
) => {
  const [progress, setProgress] = useState({ show: false, value: 0 });
  const [alertStatus, setAlertStatus] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const { refetch: s3Upload } = useQuery(
    ["getUploadUrl"],
    async () =>
      (await axiosClient.get(`/s3bucket?filename=${fileName}&path=${filePath}`))
        .data,
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        uploadImg(data);
      },
      onError: (error) => {
        console.error(error);
        setAlertStatus({
          show: true,
          type: "error",
          message: error.message,
        });
      },
    }
  );
  const { mutate: uploadImg } = useMutation(
    async (uploadUrl) => {
      if (uploadUrl) {
        setProgress((state) => ({ ...state, show: true }));
        await axios.put(uploadUrl.response, image, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress((state) => ({ ...state, value: percentCompleted }));
            if (percentCompleted === 100)
              setTimeout(() => {
                setProgress({ value: 0, show: false });
              }, 1000);
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        setProgress((state) => ({ ...state, show: false }));
        throw new Error("Upload url undefined");
      }
    },
    {
      onSuccess: (_, uploadUrl) => {
        const newData = dataCallback(data, uploadUrl);
        uploadCallback({
          data: newData,
          uploadUrl: uploadUrl?.response.split("?")[0],
        });
      },
      onError: (error) => {
        console.error(error);
        setAlertStatus({
          show: true,
          type: "error",
          message: error.message,
        });
      },
    }
  );
  const { mutate: uploadCallback } = useMutation(
    async ({ data }) => {
      switch (apiMethod) {
        case "post":
          return (await axiosClient.post(apiPath, data)).data;
        case "put":
          return (await axiosClient.put(apiPath, data)).data;
        default:
          throw new Error("Invalid http method");
      }
    },
    {
      onSuccess: (_, params) => {
        if (completedCallback) completedCallback(params.uploadUrl);
        setAlertStatus({
          show: true,
          type: "success",
          message: alertSuccessMessage,
        });
        setTimeout(() => {
          setAlertStatus({
            show: false,
            type: "success",
            message: alertSuccessMessage,
          });
        }, 5000);
      },
      onError: (error) => {
        console.error(error);
        setAlertStatus({
          show: true,
          type: "error",
          message: error.message,
        });
      },
    }
  );
  return { s3Upload, setAlertStatus, progress, alertStatus };
};
