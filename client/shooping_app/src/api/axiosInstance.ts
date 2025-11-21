import axios, { AxiosError,type InternalAxiosRequestConfig } from "axios";
import { setAccessToken, logout } from "../feature/auth/authSlice";
import { store, type RootState } from "../app/store";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

let isRefreshing = false;
let queue: any[] = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  queue = [];
};

// REQUEST INTERCEPTOR
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const state: RootState = store.getState();
  const token = state.auth.accessToken;

  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const state = store.getState();
      const refreshToken = state.auth.refreshToken;

      if (!refreshToken) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      // Queue handling (multiple requests)
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((t) => {
          original.headers.Authorization = `Bearer ${t}`;
          return api(original);
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post("http://localhost:3000/api/users/refresh", {
          token: refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        store.dispatch(
          setAccessToken(newAccessToken)
        );
        localStorage.setItem("refreshToken", newRefreshToken);

        processQueue(null, newAccessToken);

        original.headers.Authorization = `Bearer ${newAccessToken}`;

        isRefreshing = false;
        return api(original);
      } catch (err) {
        processQueue(err as AxiosError, null);
        store.dispatch(logout());
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
