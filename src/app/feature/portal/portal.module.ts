import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TuiErrorModule, TuiFormatNumberPipeModule, TuiLoaderModule, TuiSvgModule, TuiGroupModule, TuiTooltipModule, TuiButtonModule, TuiLinkModule, TuiDataListModule, TuiFormatDatePipeModule, TuiTextfieldControllerModule, } from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiIslandModule, TuiCarouselModule, TuiInputModule, TuiInputNumberModule, TuiInputFilesModule, TuiTextareaModule, TuiInputPasswordModule, TuiCheckboxBlockModule, TuiRadioBlockModule, TuiCheckboxLabeledModule, TuiInputDateModule, TuiTagModule, TuiDataListWrapperModule,  TuiSelectModule, TuiAvatarModule } from '@taiga-ui/kit';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiCurrencyPipeModule, TuiMoneyModule } from '@taiga-ui/addon-commerce';

import { PortalRoutingModule } from './portal-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ViewComponent } from './pages/view/view.component';
import { NewComponent } from './pages/new/new.component';


@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    ViewComponent,
    NewComponent,
  ],
  imports: [
    // Core
    CommonModule,
    ReactiveFormsModule,
    // Taiga UI Core
    TuiErrorModule,
    TuiSvgModule,
    TuiLoaderModule,
    TuiGroupModule,
    TuiButtonModule,
    TuiLinkModule,
    TuiTooltipModule,
    TuiDataListModule,
    TuiFormatDatePipeModule,
    TuiTextfieldControllerModule,
    // Taiga UI
    TuiInputModule,
    TuiTextareaModule,
    TuiInputPasswordModule,
    TuiInputDateModule,
    TuiInputNumberModule,
    TuiCheckboxBlockModule,
    TuiRadioBlockModule,
    TuiCheckboxLabeledModule,
    TuiIslandModule,
    TuiCarouselModule,
    TuiTagModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiAvatarModule,
    TuiInputFilesModule,
    // Taiga Addons
    TuiTableModule,
    TuiTablePaginationModule,
    TuiMoneyModule,
    // Taiga Pipes
    TuiFieldErrorPipeModule,
    TuiFormatNumberPipeModule,
    TuiCurrencyPipeModule,
    // Custom Components
    PortalRoutingModule
  ]
})
export class PortalModule { }
