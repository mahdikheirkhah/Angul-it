import { Injectable } from '@angular/core';

// This is the same interface from our CaptchaComponent
interface CaptchaImage {
  src: string;
  alt: string;
  selected: boolean;
  isCorrect?: boolean; // We'll use this later
}

export interface CaptchaChallenge {
  prompt: string;
  images: CaptchaImage[];
}

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private challenges: CaptchaChallenge[] = [];
  private currentChallengeIndex = 0;
  private userAnswers: CaptchaImage[][] = [];

  constructor() {
    this.loadState(); // Try to load saved state when the app starts
  }

  // Set up all the challenges for this session
  private initializeChallenges(): void {
    this.challenges = [
      {
        prompt: 'Please select all images containing a mountain.',
        images: [
            { src: 'https://placehold.co/150x150/f2f2f2/000?text=Mountain', alt: 'Mountain 1', selected: false, isCorrect: true },
            { src: 'https://placehold.co/150x150/f2f2f2/000?text=Car', alt: 'Car 1', selected: false, isCorrect: false },
            { src: 'https://placehold.co/150x150/f2f2f2/000?text=Mountain', alt: 'Mountain 2', selected: false, isCorrect: true },
            { src: 'https://placehold.co/150x150/f2f2f2/000?text=Beach', alt: 'Beach 1', selected: false, isCorrect: false },
        ]
      },
      {
        prompt: 'Now, please select all the cars.',
        images: [
            { src: 'https://placehold.co/150x150/f2f2f2/000?text=Tree', alt: 'Tree 1', selected: false, isCorrect: false },
            { src: 'https://placehold.co/150x150/f2f2f2/000?text=Car', alt: 'Car 1', selected: false, isCorrect: true },
            { src: 'https://placehold.co/150x150/f2f2f2/000?text=Mountain', alt: 'Mountain 1', selected: false, isCorrect: false },
            { src: 'https://placehold.co/150x150/f2f2f2/000?text=Car', alt: 'Car 2', selected: false, isCorrect: true },
        ]
      }
    ];
    this.currentChallengeIndex = 0;
    this.userAnswers = [];
  }

  getCurrentChallenge(): CaptchaChallenge | null {
    if (this.challenges.length === 0) {
      this.initializeChallenges();
      this.saveState();
    }

    if (this.currentChallengeIndex >= this.challenges.length) {
      return null; // No more challenges
    }
    return this.challenges[this.currentChallengeIndex];
  }

  // Records the answer and moves to the next challenge
  submitAnswer(selectedImages: CaptchaImage[]): boolean {
    this.userAnswers[this.currentChallengeIndex] = selectedImages;
    this.currentChallengeIndex++;
    this.saveState();

    // Return true if there are more challenges, false otherwise
    return this.currentChallengeIndex < this.challenges.length;
  }

  isCompleted(): boolean {
    return this.currentChallengeIndex >= this.challenges.length;
  }

  reset(): void {
    this.initializeChallenges();
    this.saveState();
  }

  // --- Persistence with localStorage ---
  private saveState(): void {
    const state = {
      index: this.currentChallengeIndex,
      answers: this.userAnswers
    };
    localStorage.setItem('captchaState', JSON.stringify(state));
  }

  private loadState(): void {
    const savedState = localStorage.getItem('captchaState');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.currentChallengeIndex = state.index;
      this.userAnswers = state.answers;
      // We still need the main challenge data
      this.initializeChallenges();
    } else {
      this.initializeChallenges();
    }
  }
}
