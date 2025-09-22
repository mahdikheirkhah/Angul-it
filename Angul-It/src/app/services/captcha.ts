import { Injectable } from '@angular/core';

// CHANGE 1: Simplified the types to only include math and text.
export type ChallengeType = 'math' | 'text';

export interface CaptchaChallenge {
  type: ChallengeType;
  prompt: string;
  // The 'images' property is no longer needed.
  math?: { a: number; b: number; op: '+' | '-' };
  text?: { value: string };
  answer: any;
}

@Injectable({ providedIn: 'root' })
export class CaptchaService {
  private challenges: CaptchaChallenge[] = [];
  private currentIndex = 0;
  private selections: any[] = [];
  private completed = false;

  constructor() {
    this.loadState();
    if (this.challenges.length === 0) {
      this.generateChallenges();
      this.saveState();
    }
  }

  private generateChallenges() {
    this.challenges = [];
    // Generate 3 random challenges per session (you can change this number)
    for (let i = 0; i < 3; i++) {
      // CHANGE 2: Randomly pick between only 'math' and 'text'.
      const type = (['math', 'text'][Math.floor(Math.random() * 2)] as ChallengeType);

      if (type === 'math') {
        const a = Math.floor(Math.random() * 20) + 1; // Simplified numbers
        const b = Math.floor(Math.random() * 20) + 1;
        const op = '+'; // Only using addition for simplicity
        this.challenges.push({
          type: 'math',
          prompt: `Solve the problem in the image below.`, // Generic prompt
          math: { a, b, op },
          answer: a + b
        });
      } else if (type === 'text') { // This is now the only other option
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        const len = Math.floor(Math.random() * 2) + 4; // 4 or 5 characters
        let value = '';
        for (let j = 0; j < len; j++) {
          value += chars[Math.floor(Math.random() * chars.length)];
        }
        this.challenges.push({
          type: 'text',
          // CHANGE 3: The prompt is now generic and doesn't reveal the answer.
          prompt: `Type the characters you see in the image below.`,
          text: { value },
          answer: value
        });
      }
    }
    this.currentIndex = 0;
    this.selections = [];
    this.completed = false;
  }

  getCurrentChallenge(): CaptchaChallenge | null {
    if (this.currentIndex < this.challenges.length) {
      return this.challenges[this.currentIndex];
    }
    return null;
  }

  getInProgressSelections(): any[] {
    return this.selections[this.currentIndex] || [];
  }

  updateInProgressSelections(selection: any) {
    this.selections[this.currentIndex] = selection;
    this.saveState();
  }

  submitAnswer(selection: any): boolean {
    this.selections[this.currentIndex] = selection;
    this.currentIndex++;
    this.saveState();
    if (this.currentIndex >= this.challenges.length) {
      this.completed = true;
      this.saveState();
      return false;
    }
    return true;
  }

  getResults() {
    let correct = 0;
    this.challenges.forEach((challenge, idx) => {
      const userAns = this.selections[idx];

      if (challenge.type === 'math') {
        // The Number() conversion makes the check more robust.
        if (userAns && Number(userAns) === challenge.answer) {
          correct++;
        }
      } else if (challenge.type === 'text') {
        // The check remains the same: case-insensitive and trims whitespace.
        if (userAns && userAns.trim().toUpperCase() === challenge.answer.toUpperCase()) {
          correct++;
        }
      }
    });
    return {
      score: (correct / this.challenges.length) * 100,
      total: this.challenges.length,
      correct
    };
  }

  isCompleted() {
    return this.completed;
  }

  reset() {
    this.generateChallenges();
    this.saveState();
  }

  private saveState() {
    localStorage.setItem('captcha_challenges', JSON.stringify(this.challenges));
    localStorage.setItem('captcha_index', String(this.currentIndex));
    localStorage.setItem('captcha_selections', JSON.stringify(this.selections));
    localStorage.setItem('captcha_completed', String(this.completed));
  }

  private loadState() {
    const challenges = localStorage.getItem('captcha_challenges');
    const index = localStorage.getItem('captcha_index');
    const selections = localStorage.getItem('captcha_selections');
    const completed = localStorage.getItem('captcha_completed');
    if (challenges && index && selections && completed !== null) {
      this.challenges = JSON.parse(challenges);
      this.currentIndex = Number(index);
      this.selections = JSON.parse(selections);
      this.completed = completed === 'true';
    }
  }
}