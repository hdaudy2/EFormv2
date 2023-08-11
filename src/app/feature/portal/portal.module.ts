import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TuiErrorModule, TuiFormatNumberPipeModule, TuiGroupModule, TuiTooltipModule, TuiButtonModule, TuiLinkModule, TuiDataListModule, TuiFormatDatePipeModule } from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiIslandModule, TuiCarouselModule, TuiInputModule, TuiTextareaModule, TuiInputPasswordModule, TuiCheckboxBlockModule, TuiRadioBlockModule, TuiCheckboxLabeledModule, TuiInputDateModule, TuiTagModule, TuiDataListWrapperModule,  TuiSelectModule, TuiAvatarModule } from '@taiga-ui/kit';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiMoneyModule } from '@taiga-ui/addon-commerce';

import { PortalRoutingModule } from './portal-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ViewComponent } from './pages/view/view.component';


@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    ViewComponent,
  ],
  imports: [
    // Core
    CommonModule,
    ReactiveFormsModule,
    // Taiga UI Core
    TuiErrorModule,
    TuiGroupModule,
    TuiButtonModule,
    TuiLinkModule,
    TuiTooltipModule,
    TuiDataListModule,
    TuiFormatDatePipeModule,
    // Taiga UI
    TuiInputModule,
    TuiTextareaModule,
    TuiInputPasswordModule,
    TuiInputDateModule,
    TuiCheckboxBlockModule,
    TuiRadioBlockModule,
    TuiCheckboxLabeledModule,
    TuiIslandModule,
    TuiCarouselModule,
    TuiTagModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiAvatarModule,
    // Taiga Addons
    TuiTableModule,
    TuiTablePaginationModule,
    TuiMoneyModule,
    // Taiga Pipes
    TuiFieldErrorPipeModule,
    TuiFormatNumberPipeModule,
    // Custom Components
    PortalRoutingModule
  ]
})
export class PortalModule { }
