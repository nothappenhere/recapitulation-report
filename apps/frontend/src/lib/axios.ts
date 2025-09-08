import axios from "axios";

// In production, there's no localhost so we have to make this dynamnic
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
