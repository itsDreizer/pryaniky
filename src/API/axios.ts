import axios from "axios";

export const $api = axios.create({
  baseURL: "https://test.v5.pryaniky.com/ru/data/v3/testmethods",
});

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["x-auth"] = token;
  }

  return config;
});
