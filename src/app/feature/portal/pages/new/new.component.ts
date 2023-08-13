import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TuiDay } from '@taiga-ui/cdk';
import { TuiAlertService } from '@taiga-ui/core';

import { ApplicationsService } from '@service/applications.service';

import { RemittanceModel, STATUS } from '@model/RemittanceModel.interface';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {
  UUID: string;
  application: RemittanceModel;
  ID: number;

  codeType = ["FEDWIRE", "SORTCODE", "CHIPS", "IFCS(India)", "BSB (AUS)", "ABA", "BLZ", "TRANSIT"];
  currencies = ["PKR", "AED", "USD", "GBP", "EURO", "CAD", "OMR"];
  purposes = ["Personal Transfer", "Salary", "Loan Payment", "Card Payment", "Invoice Payment", "Other"];

  selectedCurrency = "";

  constructor(
    private readonly RemittanceApplicationService: ApplicationsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly alerts: TuiAlertService
  ) { }
  readonly searchController = new FormGroup({
    UUID: new FormControl("", [Validators.required]),
  });

  readonly formController = new FormGroup({
    UUID: new FormControl(),
    Date: new FormControl(),
    BranchNo: new FormControl(),
    BranchName: new FormControl(),
    RemittingAccountName: new FormControl(),
    RemittingAccountNo: new FormControl(),
    Email: new FormControl(),
    MobileNo: new FormControl(),
    BeneficiaryName: new FormControl(),
    BeneficiaryAddress: new FormControl(),
    BeneficiaryDOB: new FormControl(),
    BeneficiaryAccountNumber: new FormControl(),
    BeneficiaryIBANNo: new FormControl(),
    BeneficiaryBankName: new FormControl(),
    BeneficiaryBankCode: new FormControl(),
    BeneficiaryBankCodeType: new FormControl(),
    BeneficiaryBankSwiftCode: new FormControl(),
    BeneficiaryBankAddress: new FormControl(),
    Currency: new FormControl(),
    Amount: new FormControl(),
    AmountInWord: new FormControl(),
    Purpose: new FormControl(),
    DetailsOfPayment: new FormControl(),
    accept: new FormControl(false),
  });

  onSearch = () => {
    const value = this.searchController.value;
    this.UUID = value.UUID;

    this.RemittanceApplicationService.Search(this.UUID).subscribe(application => {
      if (application.length == 0) {
        this.alerts.open(`No Record Found By UUID: ${this.UUID}`, { label: "Error", status: 'error' }).subscribe();
        return;
      }

      this.alerts.open(`Filling out information`, { label: "Success", status: 'info' }).subscribe();

      this.application = application[0];
      this.ID = application[0].id;

      const date = new Date(this.application.date);
      const dateArr: [number, number, number] = [date.getFullYear(), date.getMonth(), date.getDate()];

      const dob = new Date(this.application.beneficiary.dob);
      const dobDateArr: [number, number, number] = [dob.getFullYear(), dob.getMonth(), dob.getDate()];

      this.formController.get('UUID').setValue(this.application.uuid);
      this.formController.get('Date').setValue(new TuiDay(...dateArr));

      this.formController.get('BranchNo').setValue(this.application.branch.no);
      this.formController.get('BranchName').setValue(this.application.branch.name);

      this.formController.get('RemittingAccountName').setValue(this.application.remitter.title);
      this.formController.get('RemittingAccountNo').setValue(this.application.remitter.account);
      this.formController.get('Email').setValue(this.application.remitter.email);
      this.formController.get('MobileNo').setValue(this.application.remitter.mobile);

      this.formController.get('BeneficiaryName').setValue(this.application.beneficiary.name);
      this.formController.get('BeneficiaryAddress').setValue(this.application.beneficiary.address);
      this.formController.get('BeneficiaryDOB').setValue(new TuiDay(...dobDateArr));
      this.formController.get('BeneficiaryAccountNumber').setValue(this.application.beneficiary.account);
      this.formController.get('BeneficiaryIBANNo').setValue(this.application.beneficiary.iban);

      this.formController.get('BeneficiaryBankName').setValue(this.application.beneficiary.bank.name);
      this.formController.get('BeneficiaryBankCode').setValue(this.application.beneficiary.bank.code);
      this.formController.get('BeneficiaryBankCodeType').setValue(this.application.beneficiary.bank.codeType);
      this.formController.get('BeneficiaryBankSwiftCode').setValue(this.application.beneficiary.bank.swift);
      this.formController.get('BeneficiaryBankAddress').setValue(this.application.beneficiary.bank.address);

      this.formController.get('Currency').setValue(this.application.currency);
      this.formController.get('Amount').setValue(this.application.amount.toString());
      this.formController.get('AmountInWord').setValue(this.application.figure);
      this.formController.get('Purpose').setValue(this.application.Purpose);
      this.formController.get('DetailsOfPayment').setValue(this.application.detail);
    });
  }

  // onCurrencyChange = (currency) => this.selectedCurrency = `${currency} `;

  onSubmit = () => {
    this.application.stage = "branch";
    this.application.statue = STATUS.pending;

    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe(() => {
      this.alerts.open(`Successfully Initialized Remittance Application`, { label: "Success", status: 'success' }).subscribe();
      this.router.navigate(['/portal', 'dashboard']);
    });
  }
}
