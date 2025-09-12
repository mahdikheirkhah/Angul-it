import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CaptchaService } from '../services/captcha';

export const resultsGuard: CanActivateFn = (route, state) => {
  const captchaService = inject(CaptchaService);
  const router = inject(Router);

  if (captchaService.isCompleted()) {
    return true; // User has completed the challenges, allow access
  } else {
    // User has not completed, redirect to the captcha page
    router.navigate(['/captcha']);
    return false; // Block access to the results page
  }
};
