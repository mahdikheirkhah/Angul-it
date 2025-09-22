import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Captcha } from './captcha';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('Captcha', () => {
  let component: Captcha;
  let fixture: ComponentFixture<Captcha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Captcha, RouterTestingModule],
      providers: [provideNoopAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(Captcha);
    component = fixture.componentInstance;
    // We need to provide a mock challenge for the component to initialize correctly
    component.challenge = {
        type: 'text',
        prompt: 'Test Prompt',
        text: { value: 'TEST' },
        answer: 'TEST'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});