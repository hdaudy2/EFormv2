import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { FormComponent } from './pages/form/form.component';
import { CustomerComponent } from './pages/customer/customer.component';

const routes: Routes = [
  {
    path: "",
    component: CustomerComponent
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "form-remittance",
    component: FormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
