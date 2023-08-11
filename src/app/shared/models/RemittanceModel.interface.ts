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
  telephone: string;
  mobile: string;
}

interface Beneficiary {
  name: string;
  address: string;
  dob: string;
  title: string;
  iban: string;
  bank: Bank
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

export interface Comment {
  from: string;
  comment: string;
  date: number;
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
  step?: string[];
  comments?: Comment[];
  stage: 'branch' | 'operations';
  statue: 'pending' | 'approved' | 'returned' | 'rejected';
  createdOn: string;
  updatedOn: string;
}
