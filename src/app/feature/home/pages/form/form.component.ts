import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TuiDay } from '@taiga-ui/cdk';
import { TuiAlertService } from '@taiga-ui/core';

import { ApplicationsService } from '@service/applications.service';
import { RemittanceModel } from '@model/RemittanceModel.interface';

import Cookies from 'js-cookie';
import * as shortid from 'shortid';
import { CustomerModel } from '@model/CustomerModel.interface';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  customer: CustomerModel;

  currentDate: [number, number, number] = [new Date().getFullYear(), new Date().getMonth(), new Date().getDate()];
  codeType = ["FEDWIRE", "SORTCODE", "CHIPS", "IFCS(India)", "BSB (AUS)", "ABA", "BLZ", "TRANSIT"];
  currencies = ["PKR", "AED", "USD", "GBP", "EURO", "CAD", "OMR"];
  purposes = ["Personal Transfer", "Salary", "Loan Payment", "Card Payment", "Invoice Payment", "Other"];

  selectedCurrency = "";

  constructor(
    private readonly RemittanceApplicationService: ApplicationsService,
    private readonly router: Router,
    private readonly alerts: TuiAlertService
  ) { }

  ngOnInit(): void {
    this.customer = JSON.parse(Cookies.get('customer'));

    if(this.customer){
      this.formController.get('BranchNo').setValue(this.customer.branchNo);
      this.formController.get('BranchName').setValue(this.customer.branchName);
      this.formController.get('RemittingAccountName').setValue(this.customer.accountName);
      this.formController.get('RemittingAccountNo').setValue(this.customer.accountNo);
      this.formController.get('TelephoneNo').setValue(this.customer.telephoneNo);
      this.formController.get('MobileNo').setValue(this.customer.mobileNo);

      this.formController.get('BranchNo').disable();
      this.formController.get('BranchName').disable();
      this.formController.get('RemittingAccountName').disable();
      this.formController.get('RemittingAccountNo').disable();
      this.formController.get('TelephoneNo').disable();
      this.formController.get('MobileNo').disable();
    }
  }

  readonly formController = new FormGroup({
    UUID: new FormControl(shortid.generate()),
    Date: new FormControl(new TuiDay(...this.currentDate), [Validators.required]),
    BranchNo: new FormControl("", [Validators.required]),
    BranchName: new FormControl("", [Validators.required]),
    RemittingAccountName: new FormControl("", [Validators.required]),
    RemittingAccountNo: new FormControl("", [Validators.required]),
    TelephoneNo: new FormControl("", [Validators.required]),
    MobileNo: new FormControl("", [Validators.required]),
    BeneficiaryName: new FormControl("", [Validators.required]),
    BeneficiaryAddress: new FormControl("", [Validators.required]),
    BeneficiaryDOB: new FormControl(),
    BeneficiaryAccountName: new FormControl("", [Validators.required]),
    BeneficiaryIBANNo: new FormControl("", [Validators.required]),
    BeneficiaryBankName: new FormControl("", [Validators.required]),
    BeneficiaryBankCode: new FormControl("", [Validators.required]),
    BeneficiaryBankCodeType: new FormControl(),
    BeneficiaryBankSwiftCode: new FormControl("", [Validators.required]),
    BeneficiaryBankAddress: new FormControl("", [Validators.required]),
    Currency: new FormControl(),
    Amount: new FormControl("", [Validators.required]),
    AmountInWord: new FormControl("", [Validators.required]),
    Purpose: new FormControl(),
    DetailsOfPayment: new FormControl("", [Validators.required]),
    accept: new FormControl(false),
  });

  onCurrencyChange = (currency) => this.selectedCurrency = `${currency} `;
  onDateChange = (date) => console.log(new Date(date.toString()).toISOString());

  onSubmit = (): void => {
    const value: any = this.formController.value;
    const newRemittance: RemittanceModel = {
      uuid: value.UUID,
      branch: {
        no: value.BranchNo,
        name: value.BranchName,
      },
      remitter: {
        title: value.RemittingAccountName,
        account: value.RemittingAccountNo,
        telephone: value.TelephoneNo,
        mobile: value.MobileNo
      },
      beneficiary: {
        name: value.BeneficiaryName,
        address: value.BeneficiaryAddress,
        dob: new Date(value.BeneficiaryDOB?.toString()).toISOString(),
        title: value.BeneficiaryAccountName,
        iban: value.BeneficiaryIBANNo,
        bank: {
          name: value.BeneficiaryBankName,
          codeType: value.BeneficiaryBankCodeType,
          code: value.BeneficiaryBankCode,
          swift: value.BeneficiaryBankSwiftCode,
          address: value.BeneficiaryBankAddress
        }
      },
      date: new Date(value.Date?.toString()).toISOString(),
      currency: value.Currency,
      amount: value.Amount,
      figure: value.AmountInWord,
      Purpose: value.Purpose,
      detail: value.DetailsOfPayment,
      isNew: true,
      step: ["Application Submitted"],
      comments: [],
      stage: "branch",
      statue: "pending",
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    }

    this.RemittanceApplicationService.insert(newRemittance).subscribe(res => {
      this.alerts.open("Successfully Added", { label: "Form Notification", status: 'success' }).subscribe();
    }, err => {
      this.alerts.open(`Unknown Error Occurred: ${err}`, { label: "Error", status: 'error' }).subscribe();
    }, () => {
      this.router.navigate(['/'])
    });
  }
}
