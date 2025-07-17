import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// // 요청 인터셉터
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // 토큰이 있다면 헤더에 추가
//     const token = localStorage.getItem("accessToken")
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )

// // 응답 인터셉터
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       // 토큰 만료 시 로그인 페이지로 리다이렉트
//       localStorage.removeItem("accessToken")
//       window.location.href = "/login"
//     }
//     return Promise.reject(error)
//   },
// )

export default axiosInstance;
