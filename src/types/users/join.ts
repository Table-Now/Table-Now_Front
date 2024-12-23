export interface RegisterFormData {
  user: string;
  password: string;
  email: string;
  phone: string;
}

export interface RegisterResponse {
  user: string;
  password: string;
  email: string;
  phone: string;
  emailAuthYn: boolean;
  role: string;
  managerYn: boolean;
  userStatus: string;
}
