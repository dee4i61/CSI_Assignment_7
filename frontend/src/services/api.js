import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/",
  withCredentials: true,
});

// api.interceptors.request.use(
//   (config) => {
//     const token =
//       typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     console.log("token", token);

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.log("error", error);
//     if (error.response?.status === 401) {
//       console.warn("⚠ Unauthorized: possible token expiration");
//       localStorage.removeItem("token");

//       // window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
