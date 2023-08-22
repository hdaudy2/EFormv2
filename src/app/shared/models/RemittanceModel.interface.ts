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
  civilID: string;
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

export interface RemittanceModel {
  id?: number;
  uuid: string;
  branch: Branch;
  remitter: Remitter;
  beneficiary: Beneficiary;
  date: string;
  currency: string;
  amount: number;
  figure: string;
  detail: string;
  createdOn: string;
  updatedOn: string;
}
