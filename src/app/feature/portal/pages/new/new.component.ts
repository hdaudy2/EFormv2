import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TUI_DATE_FORMAT, TUI_DATE_SEPARATOR, TuiDay } from '@taiga-ui/cdk';
import { TuiAlertService } from '@taiga-ui/core';
import { TuiFileLike, tuiInputNumberOptionsProvider } from '@taiga-ui/kit';
import { Observable, of, Subject, timer } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';

import Cookies from 'js-cookie';

import { ApplicationsService } from '@service/applications.service';

import { RemittanceModel, STATUS } from '@model/RemittanceModel.interface';
import { ROLE, UserModel } from '@model/userModel.interface';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
  providers: [
    { provide: TUI_DATE_FORMAT, useValue: 'YMD' },
    { provide: TUI_DATE_SEPARATOR, useValue: '/' },
    tuiInputNumberOptionsProvider({
      decimal: 'always',
      step: 0.1,
    }),
  ],
})
export class NewComponent {
  UUID: string;
  application: RemittanceModel;
  ID: number;
  user: UserModel;

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
  ) {
    this.user = Cookies.get('auth');
    if (!this.user) this.router.navigate(['/portal']);
    this.user = JSON.parse(Cookies.get('auth'));

    this.formController.get('ChecksPerformedBy').setValue(this.user.name);
    this.formController.get('StaffID').setValue(this.user.staffID.toString());
  }

  readonly searchController = new FormGroup({
    UUID: new FormControl("", [Validators.required]),
  });

  readonly signature = new FormControl();

  onSearch = () => {
    const value = this.searchController.value;
    this.UUID = value.UUID;
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

  // onCurrencyChange = (currency) => this.selectedCurrency = `${currency} `;

  onSubmit = () => {
    this.application.exchange = 2.60;
    this.application.stage = ROLE.Branch;
    this.application.statue = STATUS.pending;
    this.application.updatedOn = new Date().toISOString();

    this.RemittanceApplicationService.updateById(this.ID, this.application).subscribe(() => {
      this.alerts.open(`Successfully Initialized Remittance Application`, { label: "Success", status: 'success' }).subscribe();
      this.router.navigate(['/portal', 'dashboard']);
    });
  }

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.signature.valueChanges.pipe(
    switchMap(file => (file ? this.makeRequest(file) : of(null))),
  );

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.signature.setValue(null);
  }

  clearRejected(): void {
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        // if (Math.random() > 0.5) {
        //   return file;
        // }

        // this.rejectedFiles$.next(file);

        // return null;
        return file;
      }),
      finalize(() => this.loadingFiles$.next(null)),
    );
  }
}
