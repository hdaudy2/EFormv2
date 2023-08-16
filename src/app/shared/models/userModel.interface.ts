export enum ROLE {
  Customer = 0,
  Branch = 1,
  OP = 2,
  Approver = 3,
}

export interface UserModel {
  id: number;
  name: string;
  email: string;
  role: ROLE;
  password: string;
  staffID: number;
}
