import axios from "axios";

// Detect localhost or production
const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://journal-app-backend-coral.vercel.app/api";

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;