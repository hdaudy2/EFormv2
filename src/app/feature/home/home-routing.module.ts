import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { FormComponent } from './pages/form/form.component';
import { CustomerComponent } from './pages/customer/customer.component';

const routes: Routes = [
  {
    path: "form-remittance/:id",
    component: FormComponent
  },
  {
    path: "form-remittance",
    component: FormComponent
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "",
    component: CustomerComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
