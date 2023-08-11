export interface UserModel {
  id: number;
  name: string;
  email: string;
  role: "teller" | "maker" | "checker";
  password: string;
  staffID: number;
}
