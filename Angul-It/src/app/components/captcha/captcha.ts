import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// 1. Corrected the import path and created an alias
import { CaptchaService, CaptchaChallenge } from '../../services/captcha';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './captcha.html',
  styleUrl: './captcha.css'
})
export class Captcha implements OnInit {
  captchaForm!: FormGroup;
  challenge!: CaptchaChallenge;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private captchaService: CaptchaService
  ) {}

  ngOnInit(): void {
    this.loadCurrentChallenge();
  }

  loadCurrentChallenge(): void {
    const current = this.captchaService.getCurrentChallenge();
    if (current) {
      this.challenge = current;
      if (current.type === 'image') {
        // If there are no correct images, don't require selection
        const requireSelection = current.answer.length > 0;
        this.captchaForm = this.fb.group({
          selections: [[], requireSelection ? [Validators.required, Validators.minLength(1)] : []]
        });
        this.updateFormSelections();
      } else if (current.type === 'math') {
        this.captchaForm = this.fb.group({
          answer: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]]
        });
      } else if (current.type === 'text') {
        this.captchaForm = this.fb.group({
          answer: ['', [Validators.required, Validators.maxLength(6)]]
        });
      }
    } else {
      this.router.navigate(['/result']);
    }
  }

  toggleSelection(image: any): void {
    if (this.challenge.type === 'image') {
      image.selected = !image.selected;
      this.updateFormSelections();
    }
  }

  private updateFormSelections(): void {
    if (this.challenge.type === 'image') {
      const selectedImages = this.challenge.images?.filter(img => img.selected) || [];
      this.captchaForm.controls['selections'].setValue(selectedImages);
      this.captchaService.updateInProgressSelections(selectedImages);
    }
  }

  onSubmit(): void {
    if (this.captchaForm.invalid) {
      return;
    }
    let answer;
    if (this.challenge.type === 'image') {
      answer = this.captchaForm.value.selections;
    } else if (this.challenge.type === 'math' || this.challenge.type === 'text') {
      answer = this.captchaForm.value.answer;
    }
    const hasMoreChallenges = this.captchaService.submitAnswer(answer);
    if (hasMoreChallenges) {
      this.loadCurrentChallenge();
      this.captchaForm.reset();
    } else {
      this.router.navigate(['/result']);
    }
  }
}
