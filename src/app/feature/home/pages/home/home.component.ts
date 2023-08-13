import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TuiAlertService } from '@taiga-ui/core';
import Cookies from 'js-cookie';

import { ApplicationsService } from '@service/applications.service';

import { CustomerModel } from '@model/CustomerModel.interface';
import { RemittanceModel, STATUS } from '@model/RemittanceModel.interface';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  customer: CustomerModel;

  // Table
  applicationList = [];
  selectedList = [];
  columns = ['no', 'name', 'iban', 'amount', 'currency', 'status', 'date', 'uuid'];
  total = 0;
  page = 0;
  size = 10;

  constructor(
    private readonly RemittanceApplicationService: ApplicationsService,
    private readonly router: Router,
    private readonly alerts: TuiAlertService) { }

  ngOnInit(): void {
    this.customer = JSON.parse(Cookies.get('customer'));
    this.RemittanceApplicationService.getAllCustomerSubmissions(this.customer?.accountNo).subscribe(list => {
      console.log(list);

      this.applicationList = list.map((el, index) => {
        let isEditable = true;
        if(el.stage === 'customer'){
          const Discrepancy = el?.Discrepancy.filter(el => el.to === "customer" && el.status === "pending").reverse()[0];
          if(Discrepancy || el.statue === 'initialized') isEditable = false;
        }

        return {
          no: index + 1,
          name: el.beneficiary.name,
          iban: el.beneficiary.iban,
          amount: el.amount,
          currency: el.currency,
          status: el.statue,
          date: el.date,
          uuid: el.uuid,
          isEditable
        }
      });

      this.total = this.applicationList.length;
      this.prepareData();
    });
  }

  prepareData() {
    let list = [...this.applicationList];
    let startingPoint = (this.page * this.size);
    let endingPoint = (this.page * this.size) + this.size;

    this.selectedList = list.slice(startingPoint, endingPoint);
    this.total = list.length;
  }

  editDisable(status) {
    let result = false;

    switch (status) {
      case STATUS.pending:
        result = true;
        break;
      case STATUS.approved:
        result = true;
        break;
      case STATUS.rejected:
        result = true;
        break;
    }

    return result;
  }

  view(uuid: string) {
    this.router.navigate(['/form-remittance', uuid]);
    console.log(uuid);
  }

  onPage(page: number) {
    this.page = page;
    this.prepareData();
  }
  onSize(size: number) {
    this.size = size;
    this.page = 0;
    this.prepareData();
  }
}
