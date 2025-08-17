import axios from "axios";

const BASE_API_URL = process.env.BASE_API_URL || "http://localhost:8000";

export const axiosInstance = axios.create({ baseURL: BASE_API_URL });

// // 토큰 검증 기능 추가.
// axiosInstance.interceptors.response;
