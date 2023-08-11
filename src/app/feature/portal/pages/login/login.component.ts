import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Cookies from 'js-cookie';
import { TuiAlertService } from '@taiga-ui/core';

import { UserService } from '@service/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private userService: UserService, private router: Router, private readonly alerts: TuiAlertService) { }

  readonly formController = new FormGroup({
    email: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });

  onSubmit() {
    const { email, password } = this.formController.value;
    this.userService.auth(email, password).subscribe((res) => {
      if (res.length === 0) {
        this.alerts.open(`Credential invalid`, { label: "Error", status: 'error' }).subscribe();
        return;
      }

      const user = res[0];
      Cookies.set('auth', JSON.stringify(user));
      this.alerts.open("Successfully Login", { label: "Notification", status: 'success' }).subscribe();
      this.router.navigate(['/portal/dashboard'])
    });
  }
}
