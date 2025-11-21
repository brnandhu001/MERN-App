import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import store, { type RootState } from "../app/store";
import { setAccessToken, logout } from "../feature/auth/authSlice";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

interface RefreshResponse {
  accessToken: string;
}

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

// --------------------
// REQUEST INTERCEPTOR
// --------------------
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const state: RootState = store.getState();
  const token = state.auth.accessToken;

  if (token) {
    if (!config.headers) config.headers = {} as any;
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  return config;
});

// --------------------
// RESPONSE INTERCEPTOR
// --------------------
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const state: RootState = store.getState();
      const refreshToken = state.auth.refreshToken;

      if (!refreshToken) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await axios.post<RefreshResponse>(
          "http://localhost:3000/api/users/refresh-token",
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        store.dispatch(setAccessToken(newAccessToken));

        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (err) {
        processQueue(err as AxiosError, null);
        isRefreshing = false;
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
