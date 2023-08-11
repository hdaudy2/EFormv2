import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
import { TuiDay } from '@taiga-ui/cdk';

import Cookies from 'js-cookie';
import formatDistance from 'date-fns/formatDistance';

import { Comment, Operations, RemittanceModel, Teller } from '@model/RemittanceModel.interface';
import { UserModel } from '@model/userModel.interface';

import { ApplicationsService } from '@service/applications.service';
import { UserService } from '@service/users.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit, OnDestroy {
  UUID: string;
  ID: number;
  user: UserModel;
  application: RemittanceModel = {} as any;

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

  commentController = new FormGroup({
    from: new FormControl(),
    comment: new FormControl(),
    date: new FormControl(),
  });

  constructor(
    private readonly userService: UserService,
    private readonly RemittanceApplicationService: ApplicationsService,
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

      if (!this.application.teller && this.user.role == 'teller') {
        this.branchController.get('ReferenceNo').setValue(this.application.uuid);
        this.branchController.get('ChecksPerformedBy').setValue(this.user.name);
        this.branchController.get('StaffID').setValue(this.user.staffID.toString());
      } else {
        const currentDate: [number, number, number] = [new Date(this.application?.teller?.Date).getFullYear(), new Date(this.application?.teller?.Date).getMonth(), new Date(this.application?.teller?.Date).getDate()];

        this.branchController.get('ReferenceNo').setValue(this.application?.teller?.ReferenceNo);
        this.branchController.get('ChecksPerformedBy').setValue(this.application?.teller?.ChecksPerformedBy);
        this.branchController.get('StaffID').setValue(this.application?.teller?.StaffID);
        this.branchController.get('Date').setValue(new TuiDay(...currentDate));
        this.branchController.get('SignatureVerified').setValue(this.application?.teller?.SignatureVerified);
      }

      if (this.user.role == 'checker') {
        this.operateController.get('ProcessedBy').setValue(this.user.name);
        if (this.application.amount < 3000) this.operateController.get('Method').setValue("ACH");
        else this.operateController.get('Method').setValue("RTGS");

        if (!this.application.step.find(el => el === "Central Operations Viewed Form")) {
          this.application.step.push("Central Operations Viewed Form");
          this.application.updatedOn = new Date().toISOString(),
          this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe();
        }
      } else {
        if (!this.application.step.find(el => el === "Branch Teller Viewed Form")) {
          this.application.step.push("Branch Teller Viewed Form");
          this.application.updatedOn = new Date().toISOString(),
          this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe();
        }
      };
    });
  }

  ngOnDestroy(): void {
    this.application.isNew = false;
    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe();
  }

  submittedByBranch() {
    let value: any = this.branchController.value;

    value = this.branchController.value;
    value = { ...value, Date: new Date(value.Date.toString()).toISOString() }

    this.application.teller = value;
    this.application.stage = 'operations';
    this.application.step.push('Application Verified by Branch');
    this.application.step.push('Redirecting to Central Ops');
    this.application.isNew = true;
    this.application.updatedOn = new Date().toISOString(),

    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe((res) => {
      this.alerts.open("Redirected To Operations", { label: "Form Notification", status: 'success' }).subscribe();
      this.router.navigate(['/portal', 'dashboard']);
    });
  }

  returnBank() {
    this.application.stage = 'branch';
    this.application.statue = 'returned';
    this.application.step.push('Redirecting back to branch');
    this.application.isNew = true;
    this.application.updatedOn = new Date().toISOString(),

    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe((res) => {
      this.alerts.open("Redirected Back to Originator", { label: "Form Notification", status: 'success' }).subscribe();
      this.router.navigate(['/portal', 'dashboard']);
    });
  }

  submittedByOperations() {
    let value = this.operateController.value as Operations;

    this.application.Operations = value;
    this.application.statue = 'approved';
    this.application.step.push("Application Approved");
    this.application.isNew = true;
    this.application.updatedOn = new Date().toISOString(),

    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe((res) => {
      this.alerts.open("Application Successfully Approved", { label: "Form Notification", status: 'success' }).subscribe();
      this.router.navigate(['/portal', 'dashboard']);
    });
  }

  prepareCommentTime(date: number){
    return formatDistance(date, Date.now())
  }

  comment() {
    const value = this.commentController.value as unknown as Comment;
    value.from = `${this.user.name}-${this.user.role}`;
    value.date = Date.now();

    this.application.comments.push(value)
    this.application.updatedOn = new Date().toISOString(),

    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe((res) => {
      this.alerts.open("Comment Added Successfully", { label: "Form Notification", status: 'success' }).subscribe();
      this.commentController.reset();
    });
  }
}
