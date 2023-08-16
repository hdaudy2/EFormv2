import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { STATUS } from '@model/RemittanceModel.interface';
import { ROLE, UserModel } from '@model/userModel.interface';
import { ApplicationsService } from '@service/applications.service';
import { UserService } from '@service/users.service';
import { TuiAlertService } from '@taiga-ui/core';
import Cookies from 'js-cookie';

interface Filter {
  stage: ROLE;
  status: STATUS;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: UserModel;
  subTitle;

  ROLE = ROLE;
  STATUS = STATUS;
  customerRole: string;

  // ApplicationOptions
  fetchNew: true;
  filter: Filter;

  // Table
  applicationList = [];
  selectedList = [];
  columns = ['no', 'name', 'accountNo', 'amount', 'currency', 'status', 'date', 'uuid'];
  total = 0;
  page = 0;
  size = 10;

  constructor(
    private readonly userService: UserService,
    private readonly RemittanceApplicationService: ApplicationsService,
    private readonly router: Router,
    private readonly alerts: TuiAlertService) { }

  ngOnInit(): void {
    this.user = Cookies.get('auth');
    if (!this.user) this.router.navigate(['/portal']);
    this.user = JSON.parse(Cookies.get('auth'));

    switch (this.user.role) {
      case ROLE.Branch:
        this.filter = {
          stage: ROLE.Branch,
          status: STATUS.pending
        }

        this.customerRole = "Branch"
        break;
      case ROLE.OP:
        this.filter = {
          stage: ROLE.OP,
          status: STATUS.pending
        }

        this.customerRole = "Operations"
        break;
      case ROLE.Approver:
        this.filter = {
          stage: ROLE.Approver,
          status: STATUS.pending
        }

        this.customerRole = "Approver"
        break;
    }

    this.RemittanceApplicationService.getAll().subscribe(applications => {
      this.applicationList = applications
        .map((el, index) => {
          return {
            no: index + 1,
            name: {
              title: el.remitter.title,
              isNew: el.isNew
            },
            accountNo: el.remitter.account,
            amount: el.amount,
            currency: el.currency,
            status: el.statue,
            date: el.date,
            uuid: el.uuid,
            stage: el.stage
          }
        });

      this.total = this.applicationList.length;
      this.prepareData();
    })

  }

  prepareData() {
    let list = this.applicationList.filter(el => el.stage === this.filter.stage && el.status === this.filter.status).map((el, index) => ({ ...el, no: index + 1 }));
    let startingPoint = (this.page * this.size);
    let endingPoint = (this.page * this.size) + this.size;

    this.selectedList = list.slice(startingPoint, endingPoint);
    this.total = list.length;
  }

  view(item: string) {
    this.router.navigate(['/portal', 'view', item]);
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

  newApplication() {
    this.router.navigate(['/portal', 'new']);
  }

  onStatueChange(status: STATUS) {
    this.filter.status = status;
    this.prepareData();
  }

  logout() {
    Cookies.remove('auth')
    this.router.navigate(['/portal'])
  }
}
