import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CaptchaService } from '../../services/captcha';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrl: './result.css'
})
export class Result implements OnInit {
  results: any = null;

  constructor(
    private captchaService: CaptchaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.results = this.captchaService.getResults();
  }

  startNewChallenge(): void {
    this.captchaService.reset();
    this.router.navigate(['/']);
  }
}
