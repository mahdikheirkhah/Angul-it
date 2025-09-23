import { Component } from '@angular/core';
import { Router } from '@angular/router'; // 1. Import the Router
import { CaptchaService } from '../../services/captcha';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  constructor(
    private router: Router,
    private captchaService: CaptchaService
  ) {}

  startChallenge(): void {
    if (this.captchaService.isCompleted()) {
      this.captchaService.reset();
    }
    this.router.navigate(['/captcha']);
  }
}