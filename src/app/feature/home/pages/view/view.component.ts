import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TUI_DATE_FORMAT, TUI_DATE_SEPARATOR, TuiDay } from '@taiga-ui/cdk';
import { TuiAlertService } from '@taiga-ui/core';
import { TuiFileLike, tuiInputNumberOptionsProvider } from '@taiga-ui/kit';
import { Observable, of, Subject, timer } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';

import { ApplicationsService } from '@service/applications.service';

import { RemittanceModel } from '@model/RemittanceModel.interface';
import { ROLE, UserModel } from '@model/userModel.interface';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers: [
    { provide: TUI_DATE_FORMAT, useValue: 'YMD' },
    { provide: TUI_DATE_SEPARATOR, useValue: '/' },
    tuiInputNumberOptionsProvider({
      decimal: 'always',
      step: 0.1,
    }),
  ],
})
export class ViewComponent {
  UUID: string;
  application: RemittanceModel;
  ID: number;

  ROLE = ROLE;

  date = new Date();
  dateArr: [number, number, number] = [this.date.getFullYear(), this.date.getMonth(), this.date.getDate()];

  formController = new FormGroup({
    ReferenceNo: new FormControl(),
    ChecksPerformedBy: new FormControl(),
    StaffID: new FormControl(),
    Date: new FormControl(new TuiDay(...this.dateArr)),
    exchangeRate: new FormControl(),
    charges: new FormControl(),
  });

  constructor(
    private readonly RemittanceApplicationService: ApplicationsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly alerts: TuiAlertService
  ) {}

  readonly searchController = new FormGroup({
    UUID: new FormControl("", [Validators.required]),
  });

  onSearch = () => {
    const value = this.searchController.value;
    this.UUID = value.UUID.replaceAll(" ", "");
    console.log(this.UUID);
    this.formController.get('ReferenceNo').setValue(this.UUID);

    this.RemittanceApplicationService.Search(this.UUID).subscribe(application => {
      if (application.length == 0) {
        this.alerts.open(`No Record Found By UUID: ${this.UUID}`, { label: "Error", status: 'error' }).subscribe();
        return;
      }

      this.alerts.open(`Filling out information`, { label: "Success", status: 'info' }).subscribe();

      this.application = application[0];
      this.ID = application[0].id;
    });
  }

  onSubmit = () => {
    this.application.updatedOn = new Date().toISOString();

    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe(() => {
      this.alerts.open(`Successfully Initialized Remittance Application`, { label: "Success", status: 'success' }).subscribe();
      this.router.navigate(['/portal', 'dashboard']);
    });
  }
}
