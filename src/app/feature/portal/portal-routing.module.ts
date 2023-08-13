import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ViewComponent } from './pages/view/view.component';
import { NewComponent } from './pages/new/new.component';

const routes: Routes = [
  {
    path: "view/:id",
    component: ViewComponent
  },
  {
    path: "new",
    component: NewComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "",
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
