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
    // Check if the current session in the service is already marked as completed.
    if (this.captchaService.isCompleted()) {
      // If it is complete, then we generate a new set of challenges.
      this.captchaService.reset();
    }

    // Now, navigate to the captcha page. This will either be the brand new
    // session we just created, or the one that was already in progress.
    this.router.navigate(['/captcha']);
  }
}