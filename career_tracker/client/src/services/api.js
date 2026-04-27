import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://notion-app-for-college-students.onrender.com",
});

export default API;
