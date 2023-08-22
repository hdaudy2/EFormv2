import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { FormComponent } from './pages/form/form.component';
import { ViewComponent } from './pages/view/view.component';
import { ResetComponent } from './pages/reset/reset.component';

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
    path: "reset",
    component: ResetComponent
  },
  {
    path: "view",
    component: ViewComponent
  },
  {
    path: "",
    component: HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
