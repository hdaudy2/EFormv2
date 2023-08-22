import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TuiAlertService } from '@taiga-ui/core';
import Cookies from 'js-cookie';

import { CustomerService } from '@service/customer.service';

import { CustomerModel } from '@model/CustomerModel.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showSearch: boolean = true;
  customer: CustomerModel;

  readonly searchController = new FormGroup({
    KYC: new FormControl("", [Validators.required]),
  });

  constructor(
    private readonly customerService: CustomerService,
    private readonly router: Router,
    private readonly alerts: TuiAlertService) { }

  ngOnInit(): void {
    const customer = Cookies.get('customer')

    if(customer) this.showSearch = false;
  }

  onSearch = () => {
    const value = this.searchController.value;

    this.customerService.getByUUID(value.KYC).subscribe(res => {
      if(res.length > 0){
        const customer = res[0];
        Cookies.set('customer', JSON.stringify(customer));
        this.showSearch = false;
        this.alerts.open("Fetching Information, Successful", { label: "Notification", status: 'success' }).subscribe();
      }else{
        this.alerts.open(`No Record Found`, { label: "Error", status: 'error' }).subscribe();
        this.searchController.reset();
      }
    });
  }
}
