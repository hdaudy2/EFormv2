import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  index = 2;

  readonly items = [
    'John Cleese',
    'Eric Idle',
    'Michael Palin',
    'Graham Chapman',
    'Terry Gilliam',
    'Terry Jones',
  ];
}
