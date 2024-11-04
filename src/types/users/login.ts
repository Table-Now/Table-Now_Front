export interface LoginFormData {
  user: string;
  password: string;
}

export interface LoginResponse {
  user: string;
  role: string;
  token: string;
}
