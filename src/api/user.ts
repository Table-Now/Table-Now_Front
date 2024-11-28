import axios from "axios";
import { RegisterFormData, RegisterResponse } from "../types/users/join";
import { LoginFormData, LoginResponse } from "../types/users/login";
import { RePassword } from "../types/users/passwordReset";
import { Delete } from "../types/users/delete";
import { MyInfoResponse } from "../types/users/myInfo";
import { EmailAuthResponse } from "../types/users/emailAuth";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const userApi = {
  register: async (data: RegisterFormData): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(`/user/register`, data);
    return response.data;
  },

  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`/user/login`, data);
    return response.data;
  },

  resetPassword: async (data: RePassword): Promise<string> => {
    const response = await axios.post(`/user/repassword`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteUser: async (user: string | null): Promise<Delete> => {
    const response = await axios.delete(`/user/delete`, {
      params: { user },
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getMyInfo: async (user: string): Promise<MyInfoResponse> => {
    const response = await axios.get<MyInfoResponse>(`/user/myinfo`, {
      params: { user },
      headers: getAuthHeader(),
    });
    return response.data;
  },
  verifyEmail: async (
    user: string,
    key: string
  ): Promise<EmailAuthResponse> => {
    const response = await axios.get<EmailAuthResponse>(`/user/email-auth`, {
      params: { user, key },
    });

    console.log("api" + response);
    return response.data;
  },
};
