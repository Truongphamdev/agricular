import axios from "axios"

const axiosClient = axios.create({
    baseURL:process.env.REACT_APP_API_BASE_URL,
    headers: {
        "Content-Type":"application/json",
    },
});
// Request Interceptor: gắn access token nếu có
axiosClient.interceptors.request.use(
  (config) => {
    const skipAuth = ['/register/', '/token/refresh/','/login/'];
    const shouldSkip = skipAuth.some((url) => config.url.includes(url));

    if (!shouldSkip) {
      const token = localStorage.getItem("access");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
}

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Gọi API refresh token
        const response = await axios.post(
          `${process.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/token/refresh/`,
          { refresh: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = response.data.access;
        localStorage.setItem("access", newAccessToken);

        // Update Authorization header cho request ban đầu
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry request ban đầu
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh token hết hạn → remove token, redirect login
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default axiosClient;