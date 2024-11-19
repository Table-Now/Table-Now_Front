export interface ReviewRegister {
  user: string | null;
  store: string;
  contents: string;
  role: string | null;
}

export interface ReviewListTypes {
  id: number;
  contents: string;
  createAt: string;
  user: string;
}
