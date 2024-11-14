export interface RegisterFormData {
  user: string;
  name: string;
  password: string;
  email: string;
  phone: string;
}

export interface RegisterResponse {
  user: string;
  name: string;
  password: string;
  email: string;
  phone: string;
  emailAuthYn: boolean;
  role: string;
  managerYn: boolean;
  userStatus: string;
}
