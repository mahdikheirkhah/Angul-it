import { TestBed } from '@angular/core/testing';
import { CaptchaService } from './captcha';

describe('CaptchaService', () => {
  let service: CaptchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaptchaService]
    });
    service = TestBed.inject(CaptchaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate 3 challenges on initialization', () => {
    const challenges = service['challenges'];
    expect(challenges.length).toBe(3);
  });

  it('should progress through challenges and complete correctly', () => {
    expect(service.isCompleted()).toBe(false);

    service.submitAnswer('any answer');
    expect(service['currentIndex']).toBe(1);
    expect(service.isCompleted()).toBe(false);

    service.submitAnswer('any answer');
    expect(service['currentIndex']).toBe(2);
    expect(service.isCompleted()).toBe(false);

    service.submitAnswer('any answer');
    expect(service['currentIndex']).toBe(3);
    expect(service.isCompleted()).toBe(true);
    expect(service.getCurrentChallenge()).toBeNull();
  });
  
  it('should reset and generate a new set of challenges', () => {
    const firstChallengePrompt = service.getCurrentChallenge()?.prompt;

    service.submitAnswer('any answer');
    expect(service['currentIndex']).toBe(1);

    service.reset();

    const newChallengePrompt = service.getCurrentChallenge()?.prompt;

    expect(service['currentIndex']).toBe(0);
    expect(service.isCompleted()).toBe(false);
    expect(newChallengePrompt).not.toBe(firstChallengePrompt);
  });
});