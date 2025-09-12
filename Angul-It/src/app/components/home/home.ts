import { Component } from '@angular/core';
import { Router } from '@angular/router'; // 1. Import the Router

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  // 2. Inject the Router service in the constructor
  constructor(private router: Router) {}

  // 3. Create the method that will be called on button click
  startChallenge(): void {
    this.router.navigate(['/captcha']);
  }
}
