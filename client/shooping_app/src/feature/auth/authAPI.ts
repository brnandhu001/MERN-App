import api from "../../api/axiosInstance";
import type { AppDispatch } from "../../app/store";
import { loginSuccess } from "./authSlice";


export const loginUser = (email: string, password: string) => 
  async (dispatch: AppDispatch) => {

  const res = await api.post("/users/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Login failed");
  }
  

  dispatch(
    loginSuccess({
      user: res.data.user,
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    })
  );
};
