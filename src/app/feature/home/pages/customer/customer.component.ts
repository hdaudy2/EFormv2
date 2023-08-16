import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { collapseAnimation, collapseOnLeaveAnimation, expandOnEnterAnimation } from 'angular-animations';

import { TuiAlertService } from '@taiga-ui/core';
import Cookies from 'js-cookie';

import { MockService } from '@service/mock.service';
import { CustomerService } from '@service/customer.service';
import { CustomerModel } from '@model/CustomerModel.interface';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  animations: [
    collapseAnimation(),
    collapseOnLeaveAnimation(),
    expandOnEnterAnimation()
  ]
})
export class CustomerComponent implements OnInit {
  role: string = '';

  constructor(private readonly mockService: MockService, private readonly customerService: CustomerService, private readonly alerts: TuiAlertService, private readonly router: Router,) { }

  ngOnInit(): void {
    Cookies.remove('customer');
  }

  type = new FormControl("", Validators.required);
  civilID = new FormControl("", Validators.required);

  readonly newController = new FormGroup({
    branchNo: new FormControl("", Validators.required),
    branchName: new FormControl("", Validators.required),
    accountName: new FormControl("", Validators.required),
    accountNo: new FormControl("", Validators.required),
    email: new FormControl("", Validators.required),
    mobileNo: new FormControl("", Validators.required),
    civilID: new FormControl("", Validators.required),
  });

  createCookie = (customer) => {
    Cookies.set('customer', JSON.stringify(customer));
    this.alerts.open("Fetching Information, Successful", { label: "Notification", status: 'success' }).subscribe();
    this.router.navigate(['/home'])
  }

  saveCustomer = (customer: CustomerModel) => {
    this.customerService.insert(customer).subscribe(res => {
      this.createCookie(customer)
    })
  }

  onChange = (role: string) => (this.role = role);

  onReset = () => {
    this.type.reset();
    this.role = undefined;
  }

  onNew = () => {
    if (this.newController.invalid) {
      this.alerts.open(`Please Provide Complete information`, { label: "Error", status: 'error' }).subscribe();
      return;
    }

    const value = this.newController.value;
    let newCustomer: CustomerModel;

    newCustomer = value as unknown as CustomerModel;
    newCustomer.balance = Math.floor(Math.random() * (5000 - 500 + 1) + 500);

    this.customerService.getByCivilID(newCustomer.civilID.toString()).subscribe(res => {
      if (res.length <= 0) {
        this.saveCustomer(newCustomer);
      }
      else {
        this.alerts.open(`Customer Already Registered using this civil ID : ${newCustomer.civilID}`, { label: "Error", status: 'error' }).subscribe();
      }
    });
  }

  onExisting = () => {
    const civil = this.civilID.value;

    if (`${civil}`.length < 8) {
      this.alerts.open(`Civil Number Invalid`, { label: "Error", status: 'error' }).subscribe();
      return;
    }

    this.customerService.getByCivilID(civil).subscribe(res => {
      if (res.length <= 0) {
        this.alerts.open(`No Record Found by this civil ID`, { label: "Error", status: 'error' }).subscribe();
      }
      else {
        this.createCookie(res[0]);
      }
    });
  }
}
