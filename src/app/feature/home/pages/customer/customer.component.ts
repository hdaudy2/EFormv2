import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TuiAlertService } from '@taiga-ui/core';
import Cookies from 'js-cookie';

import { MockService } from '@service/mock.service';
import { CustomerService } from '@service/customer.service';
import { CustomerModel } from '@model/CustomerModel.interface';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  role: string = '';

  constructor(private readonly mockService: MockService, private readonly customerService: CustomerService, private readonly alerts: TuiAlertService, private readonly router: Router,) { }

  ngOnInit(): void {
    Cookies.remove('customer');
  }

  readonly formController = new FormGroup({
    type: new FormControl("", Validators.required),
    civilID: new FormControl(),
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

  onSubmit = () => {
    const value = this.formController.value;

    if (`${value.civilID}`.length < 8) {
      this.alerts.open(`Civil Number Invalid`, { label: "Error", status: 'error' }).subscribe();
    } else {

      this.customerService.getByCivilID(value.civilID).subscribe(res => {
        if (res.length <= 0) {
          this.mockService.getMockUser(1).subscribe(res => {
            console.log(res[0]);
            let newCustomer: CustomerModel;
            newCustomer = res[0] as unknown as CustomerModel;
            newCustomer.civilID = value.civilID;

            this.saveCustomer(newCustomer);
          });
        } else {
          this.createCookie(res[0]);
        }
      });
    }
  }
}
