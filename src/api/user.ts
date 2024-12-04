import axios from "axios";
import { RegisterFormData, RegisterResponse } from "../types/users/join";
import { LoginFormData, LoginResponse } from "../types/users/login";
import { RePassword } from "../types/users/passwordReset";
import { Delete } from "../types/users/delete";
import { MyInfoResponse, MyInfoUpdate } from "../types/users/myInfo";
import { EmailAuthResponse } from "../types/users/emailAuth";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const userApi = {
  register: async (data: RegisterFormData): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(
      `${API_BASE_URL}user/register`,
      data
    );
    return response.data;
  },

  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}user/login`,
      data
    );
    return response.data;
  },

  kakaoLogin: async (data: { authorizationCode: string }) => {
    const response = await axios.get("/kakao/login", {
      params: data,
    });
    return response.data;
  },

  resetPassword: async (data: RePassword): Promise<string> => {
    const response = await axios.post(`${API_BASE_URL}user/repassword`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateUser: async (data: MyInfoUpdate): Promise<string> => {
    const response = await axios.patch(`${API_BASE_URL}user/infoupdate`, data, {
      headers: getAuthHeader(),
    });

    return response.data;
  },

  deleteUser: async (user: string | null): Promise<Delete> => {
    const response = await axios.delete(`${API_BASE_URL}user/delete`, {
      params: { user },
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getMyInfo: async (user: string | null): Promise<MyInfoResponse> => {
    const response = await axios.get<MyInfoResponse>(
      `${API_BASE_URL}user/myinfo`,
      {
        params: { user },
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },
  verifyEmail: async (
    user: string,
    key: string
  ): Promise<EmailAuthResponse> => {
    const response = await axios.get<EmailAuthResponse>(
      `${API_BASE_URL}user/email-auth`,
      {
        params: { user, key },
      }
    );

    console.log("api" + response);
    return response.data;
  },
};
