import { ROLE } from "./userModel.interface";

interface Branch {
  no: string;
  name: string;
}

interface Bank {
  name: string;
  codeType: string;
  code: string;
  swift: string;
  address: string;
}

interface Remitter {
  title: string;
  account: string;
  email: string;
  mobile: string;
}

interface Beneficiary {
  name: string;
  address: string;
  dob: string;
  account: string;
  iban: string;
  bank: Bank
}

export enum STATUS {
  initialized = "initialized",
  pending = "pending",
  approved = "approved",
  returned = "returned",
  rejected = "rejected",
}
export interface Teller {
  ReferenceNo: string;
  ChecksPerformedBy: string;
  StaffID: string;
  Date: string;
  SignatureVerified: boolean;
}

export interface Operations {
  Method: string;
  BalanceVerified: boolean;
  ProcessedBy: string;
}

export interface Discrepancy {
  id: string;
  message: string;
  to: ROLE;
  from: ROLE;
  status: "pending" | "resolved"
}

export interface RemittanceModel {
  id?: number;
  uuid: string;
  branch: Branch;
  remitter: Remitter;
  beneficiary: Beneficiary;
  teller?: Teller;
  Operations?: Operations;
  date: string;
  currency: string;
  amount: number;
  figure: string;
  Purpose: string;
  detail: string;
  isNew: boolean;
  exchange?: number;
  step?: string[];
  // comments?: Comment[];
  Discrepancy?: Discrepancy[];
  stage: ROLE;
  statue: STATUS;
  createdOn: string;
  updatedOn: string;
}
