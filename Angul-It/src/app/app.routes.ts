import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Captcha } from './components/captcha/captcha';
import { Result } from './components/result/result';
import { resultsGuard } from './guards/results-guard';

export const routes: Routes = [
    // Add a data property to each route
    { path: '', component: Home, data: { animation: 'HomePage' } },
    { path: 'captcha', component: Captcha, data: { animation: 'CaptchaPage' } },
    { 
      path: 'result', 
      component: Result,
      canActivate: [resultsGuard],
      data: { animation: 'ResultPage' } 
    },
    { path: '**', redirectTo: '', data: { animation: 'HomePage' } }
];