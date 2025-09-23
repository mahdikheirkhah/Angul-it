import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

import { CaptchaService, CaptchaChallenge } from '../../services/captcha';
import { CaptchaImage } from '../captcha-image/captcha-image';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CaptchaImage],
  templateUrl: './captcha.html',
  styleUrl: './captcha.css',
  // THIS IS THE MISSING PIECE
  animations: [
    trigger('challengeAnimation', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class Captcha implements OnInit, OnDestroy {
  captchaForm!: FormGroup;
  challenge!: CaptchaChallenge;
  private formSub!: Subscription;
  animationState: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private captchaService: CaptchaService
  ) {}

  ngOnInit(): void {
    this.loadCurrentChallenge();
  }

  ngOnDestroy(): void {
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }

  loadCurrentChallenge(): void {
    const current = this.captchaService.getCurrentChallenge();
    if (current) {
      this.animationState = !this.animationState;
      this.challenge = current;
      this.buildFormForChallenge();
    } else {
      this.router.navigate(['/result']);
    }
  }

  private buildFormForChallenge(): void {
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
    if (this.challenge.type === 'math') {
      this.captchaForm = this.fb.group({
        answer: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]]
      });
    } else { // 'text'
      this.captchaForm = this.fb.group({
        answer: ['', [Validators.required, Validators.maxLength(6)]]
      });
    }

    const inProgressAnswer = this.captchaService.getInProgressSelections();
    if (inProgressAnswer) {
      this.captchaForm.patchValue({ answer: inProgressAnswer });
    }

    this.formSub = this.captchaForm.controls['answer'].valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.captchaService.updateInProgressSelections(value);
    });
  }

  onSubmit(): void {
    if (this.captchaForm.invalid) {
      return;
    }
    const answer = this.captchaForm.value.answer;
    const hasMoreChallenges = this.captchaService.submitAnswer(answer);

    if (hasMoreChallenges) {
      this.loadCurrentChallenge();
    } else {
      this.router.navigate(['/result']);
    }
  }
}