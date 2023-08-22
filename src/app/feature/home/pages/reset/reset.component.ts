import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerModel } from '@model/CustomerModel.interface';
import { RemittanceModel } from '@model/RemittanceModel.interface';

import { ApplicationsService } from '@service/applications.service';
import { CustomerService } from '@service/customer.service';

import Cookies from 'js-cookie';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  constructor(private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly RemittanceApplicationService: ApplicationsService,
    private readonly customerService: CustomerService) { }

  ngOnInit(): void {
    Cookies.remove('customer');
    const deleteAll = this.route.snapshot.queryParamMap.get('delete');
    if (deleteAll == "") {
      combineLatest(
        this.customerService.getAll(),
        this.RemittanceApplicationService.getAll()
      ).subscribe(([customers, applications]) => {
        let customerIDList: number[] = customers.map(customer => customer.id);
        let applicationIDList: number[] = applications.map(application => application.id);
        console.log([customerIDList, applicationIDList])

        customerIDList.forEach(ID => this.customerService.deleteById(ID).subscribe())
        applicationIDList.forEach(ID => this.RemittanceApplicationService.deleteById(ID).subscribe())
      });
    }

    this.router.navigate(['/']);
  }
}
