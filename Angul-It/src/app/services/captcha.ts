import { Injectable } from '@angular/core';

interface CaptchaImage {
  src: string;
  alt: string;
  selected: boolean;
  isCorrect?: boolean;
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
  private inProgressSelections: CaptchaImage[] = [];
  constructor() {
    this.loadState(); // Try to load saved state when the app starts
  }

  // CHANGE 1: Renamed this method. Its only job now is to define the challenges.
  private _loadChallengeDefinitions(): void {
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
  }

  getCurrentChallenge(): CaptchaChallenge | null {
    // This logic is now safe because the constructor handles loading correctly.
    if (this.challenges.length === 0) {
      this.reset();
      this.saveState();
    }

    if (this.currentChallengeIndex >= this.challenges.length) {
      return null;
    }
    return this.challenges[this.currentChallengeIndex];
  }
    // CHANGE 2: New method to get the saved in-progress work.
    getInProgressSelections(): CaptchaImage[] {
      return this.inProgressSelections;
    }

    // CHANGE 3: New method to update in-progress work, called on every click.
    updateInProgressSelections(selections: CaptchaImage[]): void {
      this.inProgressSelections = selections;
      this.saveState(); // Auto-save on every change.
    }
  submitAnswer(selectedImages: CaptchaImage[]): boolean {
    this.userAnswers[this.currentChallengeIndex] = selectedImages;
    this.currentChallengeIndex++;
    // CHANGE 4: Clear in-progress work after submitting.
    this.inProgressSelections = [];
    this.saveState();
    return this.currentChallengeIndex < this.challenges.length;
  }

  isCompleted(): boolean {
    return this.currentChallengeIndex >= this.challenges.length;
  }

  // CHANGE 2: The reset method now clearly defines a new session.
  reset(): void {
    this._loadChallengeDefinitions();
    this.currentChallengeIndex = 0;
    this.userAnswers = [];
    this.inProgressSelections = [];
    this.saveState();
  }

  private saveState(): void {
    const state = {
      index: this.currentChallengeIndex,
      answers: this.userAnswers,
      inProgress: this.inProgressSelections
    };
    localStorage.setItem('captchaState', JSON.stringify(state));
  }

  private loadState(): void {
    this._loadChallengeDefinitions();
    const savedState = localStorage.getItem('captchaState');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.currentChallengeIndex = state.index;
      this.userAnswers = state.answers;
      // CHANGE 7: Load the in-progress selections.
      this.inProgressSelections = state.inProgress || [];
    } else {
      this.currentChallengeIndex = 0;
      this.userAnswers = [];
      this.inProgressSelections = [];
    }
  }

  getResults() {
    // Simple scoring logic - This method remains unchanged.
    let correctSelections = 0;
    let totalCorrectOptions = 0;

    this.challenges.forEach((challenge, index) => {
      const userSelection = this.userAnswers[index] || [];
      const userSelectedSources = userSelection.map(img => img.src);

      challenge.images.forEach(image => {
        const wasSelected = userSelectedSources.includes(image.src);
        if (image.isCorrect) {
          totalCorrectOptions++;
          if (wasSelected) {
            correctSelections++;
          }
        } else {
          if (wasSelected) {
            correctSelections--;
          }
        }
      });
    });

    return {
      score: Math.max(0, (correctSelections / totalCorrectOptions) * 100),
      challenges: this.challenges,
      userAnswers: this.userAnswers
    };
  }
}
