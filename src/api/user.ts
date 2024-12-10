import { RegisterFormData, RegisterResponse } from "../types/users/join";
import { LoginFormData, LoginResponse } from "../types/users/login";
import { RePassword } from "../types/users/passwordReset";
import { Delete } from "../types/users/delete";
import { MyInfoResponse } from "../types/users/myInfo";
import { EmailAuthResponse } from "../types/users/emailAuth";
import { instance } from "./instance";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const userApi = {
  kakaoLogin: async (code: string) => {
    const response = await instance.post(
      `kakao/login?code=${code}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  kakaoLogout: async (accessToken: string | null) => {
    const response = await instance.post(
      "kakao/logout",
      { accessToken } // 바디에 accessToken을 넣어 보냄
    );
    return response.data;
  },

  updateUser: async (phone: string | undefined): Promise<string> => {
    const response = await instance.patch(
      `kakao/infoupdate`,
      { phone },
      {
        headers: getAuthHeader(),
      }
    );

    return response.data;
  },

  deleteUser: async (user: string | null): Promise<Delete> => {
    const response = await instance.delete(`kakao/delete`, {
      params: { user },
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getMyInfo: async (user: string | null): Promise<MyInfoResponse> => {
    const response = await instance.get<MyInfoResponse>(`kakao/myinfo`, {
      params: { user },
      headers: getAuthHeader(),
    });
    return response.data;
  },

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

  resetPassword: async (data: RePassword): Promise<string> => {
    const response = await instance.post(`user/repassword`, data, {
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
