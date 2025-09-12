import { Routes } from '@angular/router';
import { Home } from './components/home/home';           // Corrected class name
import { Captcha } from './components/captcha/captcha';   // Corrected class name
import { Result } from './components/result/result';     // Corrected class name

export const routes: Routes = [
    { path: '', component: Home },           // Use the correct class here
    { path: 'captcha', component: Captcha }, // Use the correct class here
    { path: 'result', component: Result },   // Use the correct class here
    { path: '**', redirectTo: '' }
];
