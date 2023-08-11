import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { TuiErrorModule, TuiButtonModule, TuiDataListModule, TuiTextfieldControllerModule, TuiGroupModule } from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiIslandModule, TuiCarouselModule, TuiInputModule, TuiTextareaModule, TuiRadioModule, TuiRadioBlockModule, TuiInputNumberModule, TuiCheckboxLabeledModule, TuiInputDateModule, TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import { TuiCurrencyPipeModule } from '@taiga-ui/addon-commerce';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './pages/home/home.component';
import { FormComponent } from './pages/form/form.component';
import { CustomerComponent } from './pages/customer/customer.component';


@NgModule({
  declarations: [
    HomeComponent,
    FormComponent,
    CustomerComponent
  ],
  imports: [
    // Core
    CommonModule,
    ReactiveFormsModule,
    // Taiga UI Core
    TuiErrorModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TuiDataListModule,
    TuiGroupModule,
    // Taiga UI
    TuiInputModule,
    TuiTextareaModule,
    TuiInputNumberModule,
    TuiInputDateModule,
    TuiRadioModule,
    TuiRadioBlockModule,
    TuiCheckboxLabeledModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    TuiIslandModule,
    TuiCarouselModule,
    // Taiga Pipes
    TuiFieldErrorPipeModule,
    TuiCurrencyPipeModule,
    // Custom Components
    HomeRoutingModule,
  ]
})
export class HomeModule { }
