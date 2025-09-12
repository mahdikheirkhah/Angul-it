import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Captcha } from './components/captcha/captcha';
import { Result } from './components/result/result';
import { resultsGuard } from './guards/results.guard'; // 1. Import the guard

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'captcha', component: Captcha },
    {
      path: 'result',
      component: Result,
      canActivate: [resultsGuard] // 2. Apply the guard here
    },
    { path: '**', redirectTo: '' }
];
