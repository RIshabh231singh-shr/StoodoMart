import axios from "axios";

import { store } from "../store/store";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dispatch a sync action or standard literal to clear the store's state
      // This resets everything gracefully if the token is gone or expired
      store.dispatch({ type: "auth/logout/fulfilled" });

      // Optionally route them to the home page, but only if they aren't already there
      const currentPath = window.location.pathname;
      if (currentPath !== "/" && currentPath !== "/login" && currentPath !== "/signup") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;