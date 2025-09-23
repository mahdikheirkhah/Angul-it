import { Injectable } from '@angular/core';

export type ChallengeType = 'math' | 'text';
const CHALLENGES_MIN = 3;
const CHALLENGES_MAX = 6;
const MAX_MATH_VALUE = 99;
const MIN_MATH_VALUE = 1;
// CHANGE 1: We no longer need a fixed number of challenges here.

export interface CaptchaChallenge {
  type: ChallengeType;
  prompt: string;
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
    
    // CHANGE 2: Generate a random number of challenges between 3 and 6.
    // The formula is Math.floor(Math.random() * (max - min + 1)) + min
    const numberOfChallenges = Math.floor(Math.random() * (CHALLENGES_MAX - CHALLENGES_MIN + 1)) + CHALLENGES_MIN;

    for (let i = 0; i < numberOfChallenges; i++) {
      const type = (['math', 'text'][Math.floor(Math.random() * 2)] as ChallengeType);

      if (type === 'math') {
        let a = Math.floor(Math.random() * (MAX_MATH_VALUE - MIN_MATH_VALUE + 1)) + MIN_MATH_VALUE;
        let b = Math.floor(Math.random() * (MAX_MATH_VALUE - MIN_MATH_VALUE + 1)) + MIN_MATH_VALUE;
        
        // CHANGE 3: Randomly choose between '+' and '-' operators.
        const operators: Array<'+' | '-'> = ['+', '-'];
        const op = operators[Math.floor(Math.random() * operators.length)];
        let answer;

        if (op === '-') {
          // CHANGE 4: To avoid negative answers, ensure 'a' is the larger number.
          if (b > a) {
            [a, b] = [b, a]; // Swap a and b
          }
          answer = a - b;
        } else {
          answer = a + b;
        }
        
        this.challenges.push({
          type: 'math',
          prompt: `Solve the problem in the image below.`,
          // CHANGE 5: Use the dynamically chosen operator and calculated answer.
          math: { a, b, op },
          answer: answer
        });
      } else if (type === 'text') {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        const len = Math.floor(Math.random() * 2) + 4; // 4 or 5 characters
        let value = '';
        for (let j = 0; j < len; j++) {
          value += chars[Math.floor(Math.random() * chars.length)];
        }
        this.challenges.push({
          type: 'text',
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
        if (userAns && Number(userAns) === challenge.answer) {
          correct++;
        }
      } else if (challenge.type === 'text') {
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