import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CaptchaService } from '../services/captcha';

export const resultsGuard: CanActivateFn = (route, state) => {
  const captchaService = inject(CaptchaService);
  const router = inject(Router);

  if (captchaService.isCompleted()) {
    return true;
  } else {
    router.navigate(['/captcha']);
    return false;
  }
};
