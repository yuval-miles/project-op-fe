import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./layout/Layout";
import Feed from "./pages/Feed";
import Home from "./pages/Home";
import {ProfileSettings} from "./pages/ProfileSettings";
import UserPosts from "./pages/UserPosts";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route element={<Layout />}>
              <Route path="/feed" element={<Feed />} />
              <Route path="/profilesettings" element={<ProfileSettings />} />
              <Route path="/myposts" element={<UserPosts />} />
            </Route>
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
