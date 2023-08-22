import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TUI_DATE_FORMAT, TUI_DATE_SEPARATOR, TuiDay } from '@taiga-ui/cdk';
import { TuiAlertService, tuiLoaderOptionsProvider } from '@taiga-ui/core';

import { ApplicationsService } from '@service/applications.service';
import { CustomerService } from '@service/customer.service';
import { MailService } from '@service/mail.service';
import { ExternalAPIService } from '@service/externalAPI.service';

import * as shortid from 'shortid';
import Cookies from 'js-cookie';

import { MailModel } from '@model/mailModel.interface';
import { RemittanceModel } from '@model/RemittanceModel.interface';
import { CustomerModel } from '@model/CustomerModel.interface';

import * as settings from '@setting/config.json';

const config = settings;
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [
    { provide: TUI_DATE_FORMAT, useValue: 'YMD' },
    { provide: TUI_DATE_SEPARATOR, useValue: '/' },
    tuiLoaderOptionsProvider({
      size: 'l',
      inheritColor: false,
      overlay: true,
    }),
  ],
})
export class FormComponent implements OnInit {
  UUID: string;
  application: RemittanceModel;
  ID: number;
  templates = config.mailTemplates;

  customer: CustomerModel;

  currentDate: [number, number, number] = [new Date().getFullYear(), new Date().getMonth(), new Date().getDate()];
  codeType = ["FEDWIRE", "SORTCODE", "CHIPS", "IFCS(India)", "BSB (AUS)", "ABA", "BLZ", "TRANSIT"];
  currencies = ["PKR", "AED", "USD", "GBP", "EURO", "CAD", "OMR"];
  purposes = ["Personal Transfer", "Loan Payment", "Card Payment", "Invoice Payment", "Other"];

  selectedCurrency = "";
  loader = false;

  readonly formController = new FormGroup({
    UUID: new FormControl(shortid.generate()),
    Date: new FormControl(new TuiDay(...this.currentDate), [Validators.required]),
    BranchNo: new FormControl("", [Validators.required]),
    BranchName: new FormControl("", [Validators.required]),
    RemittingAccountName: new FormControl("", [Validators.required]),
    RemittingAccountNo: new FormControl("", [Validators.required]),
    CivilID: new FormControl("", [Validators.required]),
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
    DetailsOfPayment: new FormControl("", [Validators.required]),
    accept: new FormControl(false),
  });

  readonly searchController = new FormGroup({
    UUID: new FormControl("", [Validators.required]),
  });

  constructor(
    private readonly RemittanceApplicationService: ApplicationsService,
    private readonly mailService: MailService,
    private readonly externalService: ExternalAPIService,
    private readonly customerService: CustomerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly alerts: TuiAlertService
  ) {
    this.route.paramMap.subscribe(params => (this.UUID = params.get('id')));
  }

  ngOnInit(): void {
    const customer = Cookies.get('customer')

    if (customer) {
      this.customer = JSON.parse(customer);

      this.formController.get('BranchNo').setValue(this.customer.branchNo);
      this.formController.get('BranchName').setValue(this.customer.branchName);
      this.formController.get('RemittingAccountName').setValue(this.customer.accountName);
      this.formController.get('RemittingAccountNo').setValue(this.customer.accountNo);
      this.formController.get('CivilID').setValue(this.customer.civilID.toString());
      this.formController.get('Email').setValue(this.customer.email);
      this.formController.get('MobileNo').setValue(this.customer.mobileNo);
    }
  }

  prepareData = () => {
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
    this.formController.get('DetailsOfPayment').setValue(this.application.detail);
  }

  onSearch = () => {
    const value = this.searchController.value;
    this.UUID = value.UUID;
    // this.formController.get('ReferenceNo').setValue(value.UUID);

    this.RemittanceApplicationService.Search(this.UUID).subscribe(application => {
      if (application.length == 0) {
        this.alerts.open(`No Record Found By UUID: ${this.UUID}`, { label: "Error", status: 'error' }).subscribe();
        return;
      }

      this.alerts.open(`Filling out information`, { label: "Success", status: 'info' }).subscribe();

      this.application = application[0];
      this.ID = application[0].id;

      this.prepareData();
    });
  }

  onFigureChange = () => {
    const figureController = this.formController.get("Amount");
    if (figureController.dirty && figureController.touched) {
      const figure = +figureController.value;
      this.loader = true;

      this.externalService.convertFigureToWord(figure).subscribe(res => {
        setTimeout(() => {
          const inWord: string = res?.data || "***";
          figureController.markAsUntouched();
          this.formController.get("AmountInWord").setValue(inWord.toUpperCase());
          this.loader = false;
        }, 1000);
      })
    }
  }

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
        civilID: value.CivilID,
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
      detail: value.DetailsOfPayment,
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    }

    const customer: CustomerModel = {
      uuid: shortid.generate(),
      branchNo: value.BranchNo,
      branchName: value.BranchName,
      accountName: value.RemittingAccountName,
      civilID: value.CivilID,
      accountNo: value.RemittingAccountNo,
      email: value.Email,
      mobileNo: value.MobileNo
    }

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

      if(!this.customer){
        this.customerService.insert(customer).subscribe(res => {
          Cookies.set('customer', JSON.stringify(res));
        });

        mailBody.html = mailBody.html.replace("[NEW_KYC]", `Your KYC ID is this <strong>"${customer.uuid}</strong>". <br /><br />`);
      }else{
        mailBody.html = mailBody.html.replace("[NEW_KYC]", `For your reminder, your KYC ID is this <strong>${this.customer.uuid}</strong>. <br /><br />`);
      }

      this.mailService.createAndSendPdfMail(mailBody).subscribe(res => {
        this.alerts.open(`Successfully Sent to ${newRemittance.remitter.email}`, { label: "Email Notification", status: 'success' }).subscribe();
      });
    }, err => {
      this.alerts.open(`Unknown Error Occurred: ${err}`, { label: "Error", status: 'error' }).subscribe();
    }, () => {
      this.router.navigate(['/'])
    });

  }
}
