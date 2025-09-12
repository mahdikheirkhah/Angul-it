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
export class Captcha implements OnInit { // This is the component class
  captchaForm!: FormGroup;
  challenge!: CaptchaChallenge;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private captchaService: CaptchaService // 2. Use the alias here
  ) {}

  ngOnInit(): void {
    this.loadCurrentChallenge();
    this.captchaForm = this.fb.group({
      selections: [[], [Validators.required, Validators.minLength(1)]]
    });
    this.updateFormSelections()
  }

 loadCurrentChallenge(): void {
   const current = this.captchaService.getCurrentChallenge();
   if (current) {
     this.challenge = current;
     const inProgressSelections = this.captchaService.getInProgressSelections();
     const inProgressAlts = inProgressSelections.map(img => img.alt);
     this.challenge.images.forEach(image => {
       image.selected = inProgressAlts.includes(image.alt);
     });

   } else {
     this.router.navigate(['/result']);
   }
 }

  toggleSelection(image: any): void {
    image.selected = !image.selected;
    this.updateFormSelections();
  }

  private updateFormSelections(): void {
    const selectedImages = this.challenge.images.filter(img => img.selected);
    // Update the form for validation
    this.captchaForm.controls['selections'].setValue(selectedImages);
    // CHANGE 2: Tell the service about the latest selections to auto-save.
    this.captchaService.updateInProgressSelections(selectedImages);
  }

  onSubmit(): void {
    if (this.captchaForm.invalid) {
      return;
    }

    const hasMoreChallenges = this.captchaService.submitAnswer(
      this.captchaForm.value.selections
    );

    if (hasMoreChallenges) {
      this.loadCurrentChallenge();
      this.captchaForm.reset({ selections: [] });
    } else {
      this.router.navigate(['/result']);
    }
  }
}
