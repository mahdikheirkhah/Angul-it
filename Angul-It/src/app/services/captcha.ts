import { Injectable } from '@angular/core';

export type ChallengeType = 'math' | 'image' | 'text';

export interface CaptchaChallenge {
  type: ChallengeType;
  prompt: string;
  images?: { src: string; alt: string; selected?: boolean }[];
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
    // Generate 5 random challenges per session
    this.challenges = [];
    for (let i = 0; i < 5; i++) {
      const type = (['math', 'image', 'text'][Math.floor(Math.random() * 3)] as ChallengeType);
      if (type === 'math') {
        const a = Math.floor(Math.random() * 90) + 10;
        const b = Math.floor(Math.random() * 90) + 10;
        const op = Math.random() > 0.5 ? '+' : '-';
        this.challenges.push({
          type: 'math',
          prompt: `What is ${a} ${op} ${b}?`,
          math: { a, b, op },
          answer: op === '+' ? a + b : a - b
        });
      } else if (type === 'image') {
        // Static image URLs for categories
        const categories = [
          { name: 'tree', urls: [
            'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&q=80'
          ]},
          { name: 'car', urls: [
            'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=100&q=80',
            'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=100&q=80'
          ]},
          { name: 'cat', urls: [
            'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=100&q=80',
            'https://images.unsplash.com/photo-1518715308788-300e1e1e1e1e?auto=format&fit=crop&w=100&q=80'
          ]},
          { name: 'dog', urls: [
            'https://images.unsplash.com/photo-1518715308788-300e1e1e1e1e?auto=format&fit=crop&w=100&q=80',
            'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=100&q=80'
          ]},
          { name: 'flower', urls: [
            'https://images.unsplash.com/photo-1465101178521-c1a4c8a1f7c1?auto=format&fit=crop&w=100&q=80',
            'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=100&q=80'
          ]},
          { name: 'mountain', urls: [
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=100&q=80',
            'https://images.unsplash.com/photo-1465101178521-c1a4c8a1f7c1?auto=format&fit=crop&w=100&q=80'
          ]}
        ];
        const categoryObj = categories[Math.floor(Math.random() * categories.length)];
        const category = categoryObj.name;
        // 2 images with category, 7 random images from other categories
        const images: { src: string; alt: string; selected?: boolean; category?: string }[] = [];
        categoryObj.urls.forEach(url => {
          images.push({ src: url, alt: category, selected: false, category });
        });
        while (images.length < 9) {
          const otherCategoryObj = categories.filter(c => c.name !== category)[Math.floor(Math.random() * (categories.length - 1))];
          const url = otherCategoryObj.urls[Math.floor(Math.random() * otherCategoryObj.urls.length)];
          images.push({ src: url, alt: otherCategoryObj.name, selected: false, category: otherCategoryObj.name });
        }
        // Shuffle images
        for (let k = images.length - 1; k > 0; k--) {
          const l = Math.floor(Math.random() * (k + 1));
          [images[k], images[l]] = [images[l], images[k]];
        }
        // Sometimes, allow no correct images (10% chance)
        let answerAlts: string[] = [];
        if (Math.random() > 0.1) {
          answerAlts = images.filter(img => img.alt === category).map(img => img.alt + img.src);
        }
        this.challenges.push({
          type: 'image',
          prompt: `Select all pictures with ${category} in them`,
          images: images.map(img => ({
            src: img.src,
            alt: img.alt + img.src, // make alt unique for answer checking
            selected: false
          })),
          answer: answerAlts
        });
      } else if (type === 'text') {
        // Generate random 4-6 character string
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        const len = Math.floor(Math.random() * 3) + 4;
        let value = '';
        for (let j = 0; j < len; j++) {
          value += chars[Math.floor(Math.random() * chars.length)];
        }
        this.challenges.push({
          type: 'text',
          prompt: `Type the characters you see: ${value}`,
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
        if (userAns && Number(userAns) === challenge.answer) correct++;
      } else if (challenge.type === 'image') {
        const selectedAlts = (userAns || []).filter((img: any) => img.selected).map((img: any) => img.alt);
        if (
          challenge.answer.length === 0 && selectedAlts.length === 0 // no correct images, user can skip
          || (
            selectedAlts.length === challenge.answer.length &&
            selectedAlts.every((alt: string) => challenge.answer.includes(alt))
          )
        ) {
          correct++;
        }
      } else if (challenge.type === 'text') {
        if (userAns && userAns.trim().toUpperCase() === challenge.answer.toUpperCase()) correct++;
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
