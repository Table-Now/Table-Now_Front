export interface MyInfoResponse {
  user: string;
  name: string;
  email: string;
  phone: string;
  createAt: string;
}

export interface MyInfoUpdate {
  password: string;
  email: string;
  phone: string;
}
