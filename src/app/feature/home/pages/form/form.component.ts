import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TUI_DATE_FORMAT, TUI_DATE_SEPARATOR, TuiDay } from '@taiga-ui/cdk';
import { TuiAlertService } from '@taiga-ui/core';

import { ApplicationsService } from '@service/applications.service';
import { Discrepancy, RemittanceModel, STATUS } from '@model/RemittanceModel.interface';

import Cookies from 'js-cookie';
import * as shortid from 'shortid';
import { CustomerModel } from '@model/CustomerModel.interface';
import { MailService } from '@service/mail.service';
import { MailModel } from '@model/mailModel.interface';

import * as settings from '@setting/config.json';

const config = settings;
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [
    { provide: TUI_DATE_FORMAT, useValue: 'YMD' },
    { provide: TUI_DATE_SEPARATOR, useValue: '/' },
  ],
})
export class FormComponent implements OnInit {
  UUID: string;
  application: RemittanceModel;
  ID: number;
  templates = config.mailTemplates;

  discrepancy: Discrepancy;
  customer: CustomerModel;

  currentDate: [number, number, number] = [new Date().getFullYear(), new Date().getMonth(), new Date().getDate()];
  codeType = ["FEDWIRE", "SORTCODE", "CHIPS", "IFCS(India)", "BSB (AUS)", "ABA", "BLZ", "TRANSIT"];
  currencies = ["PKR", "AED", "USD", "GBP", "EURO", "CAD", "OMR"];
  purposes = ["Personal Transfer", "Loan Payment", "Card Payment", "Invoice Payment", "Other"];

  selectedCurrency = "";

  constructor(
    private readonly RemittanceApplicationService: ApplicationsService,
    private readonly mailService: MailService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly alerts: TuiAlertService
  ) {
    this.route.paramMap.subscribe(params => (this.UUID = params.get('id')));
  }

  ngOnInit(): void {
    if (this.UUID) {
      this.RemittanceApplicationService.getByUUID(this.UUID).subscribe(application => {
        if (application.length > 0) {
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

          this.discrepancy = this.application.Discrepancy.filter(el => el.to === "customer" && el.status === "pending").reverse()[0];
        } else {
          this.alerts.open(`No Record Found By UUID: ${this.UUID}`, { label: "Error", status: 'error' }).subscribe();
          this.router.navigate(['/home']);
        }
      })
    } else {
      this.customer = JSON.parse(Cookies.get('customer'));

      if (this.customer) {
        this.formController.get('BranchNo').setValue(this.customer.branchNo);
        this.formController.get('BranchName').setValue(this.customer.branchName);
        this.formController.get('RemittingAccountName').setValue(this.customer.accountName);
        this.formController.get('RemittingAccountNo').setValue(this.customer.accountNo);
        this.formController.get('Email').setValue(this.customer.email);
        this.formController.get('MobileNo').setValue(this.customer.mobileNo);
      }
    }

  }

  readonly formController = new FormGroup({
    UUID: new FormControl(shortid.generate()),
    Date: new FormControl(new TuiDay(...this.currentDate), [Validators.required]),
    BranchNo: new FormControl("", [Validators.required]),
    BranchName: new FormControl("", [Validators.required]),
    RemittingAccountName: new FormControl("", [Validators.required]),
    RemittingAccountNo: new FormControl("", [Validators.required]),
    Email: new FormControl("", [Validators.required]),
    MobileNo: new FormControl("", [Validators.required]),
    BeneficiaryName: new FormControl("", [Validators.required]),
    BeneficiaryAddress: new FormControl("", [Validators.required]),
    BeneficiaryDOB: new FormControl(),
    BeneficiaryAccountNumber: new FormControl("", [Validators.required]),
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

  // onCurrencyChange = (currency) => this.selectedCurrency = `${currency} `;
  // onDateChange = (date) => console.log(new Date(date.toString()).toISOString());

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
        email: value.Email,
        mobile: value.MobileNo
      },
      beneficiary: {
        name: value.BeneficiaryName,
        address: value.BeneficiaryAddress,
        dob: value.BeneficiaryDOB.toString().split(".").reverse().join("-"),
        account: value.BeneficiaryAccountNumber,
        iban: value.BeneficiaryIBANNo,
        bank: {
          name: value.BeneficiaryBankName,
          codeType: value.BeneficiaryBankCodeType,
          code: value.BeneficiaryBankCode,
          swift: value.BeneficiaryBankSwiftCode,
          address: value.BeneficiaryBankAddress
        }
      },
      date: value.Date.toString().split(".").reverse().join("-"),
      currency: value.Currency,
      amount: value.Amount,
      figure: value.AmountInWord,
      Purpose: value.Purpose,
      detail: value.DetailsOfPayment,
      isNew: true,
      step: ["Application Submitted"],
      Discrepancy: [],
      stage: "customer",
      statue: STATUS.initialized,
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    }

    if (this.UUID) {
      if(this.discrepancy){
        newRemittance.stage = this.discrepancy.from;

        this.discrepancy.status = "resolved";
        newRemittance.step = [...this.application.step, "Customer Update Information", `Redirected Back to ${newRemittance.stage}`];
        newRemittance.Discrepancy = this.application.Discrepancy;
        newRemittance.statue = STATUS.returned;
        newRemittance.createdOn = this.application.createdOn;


        this.RemittanceApplicationService.updateById(this.ID, newRemittance).subscribe((res) => {
          this.alerts.open(`Redirected Back to ${newRemittance.stage}`, { label: "Form Notification", status: 'success' }).subscribe();
          this.router.navigate(['/home']);
        });
      }else{
        newRemittance.step = [...this.application.step, "Customer Edited Application"];
        newRemittance.createdOn = this.application.createdOn;

        this.RemittanceApplicationService.updateById(this.ID, newRemittance).subscribe((res) => {
          this.alerts.open(`Application Updated`, { label: "Form Notification", status: 'success' }).subscribe();
          this.router.navigate(['/home']);
        });
      }
    }
    else {
      const htmlTemplate = this.templates.newSubmission;
      const html = htmlTemplate.replace("[Customers Name]", newRemittance.remitter.title);

      const mailBody: MailModel = {
        name: "Bank Nizwa",
        to: newRemittance.remitter.email,
        subject: "Thank You Submitting for Remittance Request - Next Steps",
        html,
        data: newRemittance
      }

      this.RemittanceApplicationService.insert(newRemittance).subscribe(res => {
        this.alerts.open("Successfully Added", { label: "Form Notification", status: 'success' }).subscribe();
        this.mailService.createAndSendPdfMail(mailBody).subscribe(res => {
          console.log(res);
          this.alerts.open(`Successfully Sent to ${newRemittance.remitter.email}`, { label: "Email Notification", status: 'success' }).subscribe();
        });
      }, err => {
        this.alerts.open(`Unknown Error Occurred: ${err}`, { label: "Error", status: 'error' }).subscribe();
      }, () => {
        this.router.navigate(['/home'])
      });

    }
  }
}
