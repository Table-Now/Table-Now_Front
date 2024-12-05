import { RegisterFormData, RegisterResponse } from "../types/users/join";
import { LoginFormData, LoginResponse } from "../types/users/login";
import { RePassword } from "../types/users/passwordReset";
import { Delete } from "../types/users/delete";
import { MyInfoResponse, MyInfoUpdate } from "../types/users/myInfo";
import { EmailAuthResponse } from "../types/users/emailAuth";
import { instance } from "./instance";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const userApi = {
  register: async (data: RegisterFormData): Promise<RegisterResponse> => {
    const response = await instance.post<RegisterResponse>(
      `user/register`,
      data
    );
    return response.data;
  },

  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await instance.post<LoginResponse>(`user/login`, data);
    return response.data;
  },

  kakaoLogin: async (data: { authorizationCode: string }) => {
    const response = await instance.get("/kakao/login", {
      params: data,
    });
    return response.data;
  },

  resetPassword: async (data: RePassword): Promise<string> => {
    const response = await instance.post(`user/repassword`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateUser: async (data: MyInfoUpdate): Promise<string> => {
    const response = await instance.patch(`user/infoupdate`, data, {
      headers: getAuthHeader(),
    });

    return response.data;
  },

  deleteUser: async (user: string | null): Promise<Delete> => {
    const response = await instance.delete(`user/delete`, {
      params: { user },
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getMyInfo: async (user: string | null): Promise<MyInfoResponse> => {
    const response = await instance.get<MyInfoResponse>(`user/myinfo`, {
      params: { user },
      headers: getAuthHeader(),
    });
    return response.data;
  },
  verifyEmail: async (
    user: string,
    key: string
  ): Promise<EmailAuthResponse> => {
    const response = await instance.get<EmailAuthResponse>(`user/email-auth`, {
      params: { user, key },
    });

    return response.data;
  },
};
