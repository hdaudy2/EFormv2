import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
import { TUI_DATE_FORMAT, TUI_DATE_SEPARATOR, TuiDay } from '@taiga-ui/cdk';

import Cookies from 'js-cookie';
import formatDistance from 'date-fns/formatDistance';
import * as shortid from 'shortid';

// import { Comment, Operations, RemittanceModel, STATUS, Teller } from '@model/RemittanceModel.interface';
import { Discrepancy, Operations, RemittanceModel, STATUS } from '@model/RemittanceModel.interface';
import { ROLE, UserModel } from '@model/userModel.interface';

import { ApplicationsService } from '@service/applications.service';
import { CustomerService } from '@service/customer.service';
import { CustomerModel } from '@model/CustomerModel.interface';
import { MailService } from '@service/mail.service';
import { MailModel } from '@model/mailModel.interface';

import * as settings from '@setting/config.json';

const config = settings;
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers: [
    { provide: TUI_DATE_FORMAT, useValue: 'YMD' },
    { provide: TUI_DATE_SEPARATOR, useValue: '/' },
  ],
})
export class ViewComponent implements OnInit, OnDestroy {
  UUID: string;
  ID: number;
  user: UserModel;
  application: RemittanceModel = {} as any;
  customer: CustomerModel;
  discrepancy: Discrepancy;
  redirecting = false;

  ROLE = ROLE;
  STATUS = STATUS

  redirectList: string[] = [];
  applicationReject = false;

  templates = config.mailTemplates;

  branchController = new FormGroup({
    ReferenceNo: new FormControl(),
    ChecksPerformedBy: new FormControl(),
    StaffID: new FormControl(),
    Date: new FormControl(),
    SignatureVerified: new FormControl(false),
  });

  operateController = new FormGroup({
    Method: new FormControl(),
    BalanceVerified: new FormControl(false),
    ProcessedBy: new FormControl(),
  });

  discrepancyController = new FormGroup({
    id: new FormControl(shortid.generate()),
    to: new FormControl(),
    from: new FormControl(),
    message: new FormControl(),
    status: new FormControl("pending")
  });

  constructor(
    private readonly RemittanceApplicationService: ApplicationsService,
    private readonly mailService: MailService,
    private readonly customerService: CustomerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly alerts: TuiAlertService) {

    this.route.paramMap.subscribe(params => (this.UUID = params.get('id')));
  }

  ngOnInit(): void {
    this.user = Cookies.get('auth');
    if (!this.user) this.router.navigate(['/portal']);
    this.user = JSON.parse(Cookies.get('auth'));

    this.RemittanceApplicationService.getByUUID(this.UUID).subscribe(application => {
      if (application.length > 0) {
        this.application = application[0];
        this.ID = application[0].id;
      } else {
        this.alerts.open(`No Record Found By UUID: ${this.UUID}`, { label: "Error", status: 'error' }).subscribe();
        this.router.navigate(['/portal', 'dashboard']);
      }

      this.customerService.getByAccountNo(this.application.remitter.account).subscribe(list => {
        if (list.length > 0) {
          this.customer = list[0];

          if (this.user.role == ROLE.OP) {
            if (this.customer?.balance > this.application.amount / this.application?.exchange) {
              this.operateController.get('BalanceVerified').setValue(true);
              this.alerts.open("Account have enough Balance to perform this transaction", { label: "Balance Check Auto Performed", status: 'success' }).subscribe();
              this.applicationReject = false;
            } else {
              this.operateController.get('BalanceVerified').setValue(false);
              this.alerts.open("Account have not enough Balance to perform this transaction", { label: "Balance Check Auto Performed", status: 'error' }).subscribe();
              this.applicationReject = true;
            }
          }
        }
      })

      if (!this.application.teller && this.user.role == ROLE.Branch) {
        this.branchController.get('ReferenceNo').setValue(this.application.uuid);
        this.branchController.get('ChecksPerformedBy').setValue(this.user.name);
        this.branchController.get('StaffID').setValue(this.user.staffID.toString());
      } else if (!this.application.Operations && this.user.role == ROLE.OP) {
        const currentDate: [number, number, number] = [new Date(this.application?.teller?.Date).getFullYear(), new Date(this.application?.teller?.Date).getMonth(), new Date(this.application?.teller?.Date).getDate()];

        this.branchController.get('ReferenceNo').setValue(this.application?.teller?.ReferenceNo);
        this.branchController.get('ChecksPerformedBy').setValue(this.application?.teller?.ChecksPerformedBy);
        this.branchController.get('StaffID').setValue(this.application?.teller?.StaffID);
        this.branchController.get('Date').setValue(new TuiDay(...currentDate));
        this.branchController.get('SignatureVerified').setValue(this.application?.teller?.SignatureVerified);
      } else {
        const currentDate: [number, number, number] = [new Date(this.application?.teller?.Date).getFullYear(), new Date(this.application?.teller?.Date).getMonth(), new Date(this.application?.teller?.Date).getDate()];

        this.branchController.get('ReferenceNo').setValue(this.application?.teller?.ReferenceNo);
        this.branchController.get('ChecksPerformedBy').setValue(this.application?.teller?.ChecksPerformedBy);
        this.branchController.get('StaffID').setValue(this.application?.teller?.StaffID);
        this.branchController.get('Date').setValue(new TuiDay(...currentDate));
        this.branchController.get('SignatureVerified').setValue(this.application?.teller?.SignatureVerified);

        this.operateController.get('Method').setValue(this.application?.Operations?.Method);
        this.operateController.get('BalanceVerified').setValue(this.application?.Operations?.BalanceVerified);
        this.operateController.get('ProcessedBy').setValue(this.application?.Operations?.ProcessedBy);

      }

      if (this.user.role == ROLE.Approver) {
        this.redirectList = ["customer", "branch", "operation"];

        this.discrepancyController.get('from').setValue(ROLE.Approver);
      }
      else if (this.user.role == ROLE.OP) {
        this.redirectList = ["customer", "branch"]

        this.operateController.get('ProcessedBy').setValue(this.user.name);

        this.discrepancyController.get('from').setValue(ROLE.OP);
        this.discrepancy = this.application.Discrepancy.filter(el => el.to === ROLE.OP && el.status === STATUS.pending).reverse()[0];

        if (this.application.amount / this.application?.exchange < 3000) {
          this.operateController.get('Method').setValue("ACH");
          this.alerts.open("On Bases on Amount 'ACH' is selected", { label: "Payment Check Auto Performed", status: 'success' }).subscribe();
        }
        else {
          this.operateController.get('Method').setValue("RTGS");
          this.alerts.open("On Bases on Amount 'RTGS' is selected", { label: "Payment Check Auto Performed", status: 'success' }).subscribe();
        }

        if (!this.application.step.find(el => el === "Central Operations Viewed Form")) {
          this.application.step.push("Central Operations Viewed Form");
          this.application.updatedOn = new Date().toISOString(),
            this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe();
        }
      } else {
        this.redirectList = ["customer"]
        this.discrepancyController.get('from').setValue(ROLE.Branch);
        this.discrepancy = this.application.Discrepancy.filter(el => el.to === ROLE.Branch && el.status === STATUS.pending).reverse()[0];

        if (!this.application.step.find(el => el === "Branch Teller Viewed Form")) {
          this.application.step.push("Branch Teller Viewed Form");
          this.application.updatedOn = new Date().toISOString(),
            this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe();
        }
      };
    });
  }

  ngOnDestroy(): void {
    if (!this.redirecting) this.application.isNew = false;
    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe();
  }

  onBalanceCheckChanged(value: boolean) {
    this.applicationReject = !value;
  }

  returnTo() {
    const value = this.discrepancyController.value;
    let step;

    switch (value.to) {
      case "operation":
        value.to = ROLE.OP;
        this.application.stage = ROLE.OP;
        this.application.statue = STATUS.returned;
        step = 'Redirecting back to Operations';

        this.redirecting = true
        break;
      case "branch":
        value.to = ROLE.Branch;
        this.application.stage = ROLE.Branch;
        this.application.statue = STATUS.returned;
        step = 'Redirecting back to branch';

        this.redirecting = true
        break;
      case "customer":
        value.to = ROLE.Customer;
        this.application.stage = ROLE.Customer;
        this.application.statue = STATUS.returned;
        step = 'Redirecting back to customer';

        const htmlTemplate = this.templates.discrepancy;
        const html = htmlTemplate.replace("[Customers Name]", this.customer.accountName).replace("[Reference Number]", this.UUID);

        const mailBody: MailModel = {
          name: "Bank Nizwa",
          to: this.customer.email,
          subject: `Important Notice Regarding Your Remittance Request (Reference #${this.UUID})`,
          html
        }

        this.mailService.sendMail(mailBody).subscribe(res => {
          this.alerts.open(`Successfully Sent to ${this.customer.email}`, { label: "Email Notification", status: 'success' }).subscribe();
        });

        this.redirecting = true
        break;
    }

    this.application.Discrepancy.push(value as Discrepancy);
    this.application.isNew = true;
    this.application.step.push(step);
    this.application.updatedOn = new Date().toISOString();

    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe((res) => {
      this.alerts.open(step, { label: "Form Notification", status: 'success' }).subscribe();
      this.router.navigate(['/portal', 'dashboard']);
    });
  }

  submittedByBranch() {
    let value: any = this.branchController.value;

    value = this.branchController.value;
    value = { ...value, Date: value.Date.toString().split(".").reverse().join("-") }

    this.application.teller = value;
    this.application.stage = ROLE.OP;
    this.application.step.push('Application Verified by Branch');
    this.application.step.push('Redirecting to Central Ops');
    this.application.isNew = true;
    this.application.statue = STATUS.pending;
    this.application.updatedOn = new Date().toISOString();
    this.redirecting = true;

    if (this.discrepancy) {
      this.discrepancy.status = "resolved";
      this.application.statue = STATUS.returned;
    }

    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe((res) => {
      this.alerts.open("Redirected To Operations", { label: "Form Notification", status: 'success' }).subscribe();
      this.router.navigate(['/portal', 'dashboard']);
    });
  }

  submittedByOperations() {
    let value = this.operateController.value as Operations;

    this.application.Operations = value;
    this.application.stage = ROLE.Approver;
    this.application.step.push("Application Verified by Operations");
    this.application.step.push("Redirecting to Central Ops Approver");
    this.application.isNew = true;
    this.application.statue = STATUS.pending;
    this.application.updatedOn = new Date().toISOString();

    if (this.discrepancy) {
      this.discrepancy.status = "resolved";
      this.application.statue = STATUS.returned;
    }

    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe((res) => {
      this.alerts.open("Redirected To Central Ops Approver", { label: "Form Notification", status: 'success' }).subscribe();
      this.router.navigate(['/portal', 'dashboard']);
    });
  }

  submittedByApprover() {
    let value = this.operateController.value as Operations;

    this.application.Operations = value;
    this.application.statue = STATUS.approved;
    this.application.step.push("Application Approved");
    this.application.isNew = true;
    this.application.updatedOn = new Date().toISOString();

    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe((res) => {
      this.alerts.open("Application Successfully Approved", { label: "Form Notification", status: 'success' }).subscribe();
      this.router.navigate(['/portal', 'dashboard']);
    });

    const htmlTemplate = this.templates.approved;
    const html = htmlTemplate.replace("[Customers Name]", this.customer.accountName).replace("[Reference Number]", this.UUID);

    const mailBody: MailModel = {
      name: "Bank Nizwa",
      to: this.customer.email,
      subject: "Notification: Approval of Your Remittance Application",
      html
    }

    this.mailService.sendMail(mailBody).subscribe(res => {
      this.alerts.open(`Successfully Sent to ${this.customer.email}`, { label: "Email Notification", status: 'success' }).subscribe();
    });
  }



  prepareCommentTime(date: number) {
    return formatDistance(date, Date.now())
  }

  reject() {
    this.application.stage = ROLE.Customer;
    this.application.statue = STATUS.rejected;
    this.application.updatedOn = new Date().toISOString();

    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe((res) => {
      this.alerts.open("Application Rejected", { label: "Form Notification", status: 'error' }).subscribe();
      this.router.navigate(['/portal', 'dashboard']);
    });

    const htmlTemplate = this.templates.rejected;
    const html = htmlTemplate.replace("[Customers Name]", this.customer.accountName).replace("[Reference Number]", this.UUID);

    const mailBody: MailModel = {
      name: "Bank Nizwa",
      to: this.customer.email,
      subject: "Notification: Rejection of Your Remittance Application",
      html
    }

    this.mailService.sendMail(mailBody).subscribe(res => {
      this.alerts.open(`Successfully Sent to ${this.customer.email}`, { label: "Email Notification", status: 'success' }).subscribe();
    });
  }
}
