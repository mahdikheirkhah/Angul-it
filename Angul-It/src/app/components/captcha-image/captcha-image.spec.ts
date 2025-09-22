import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptchaImage } from './captcha-image';

describe('CaptchaImage', () => {
  let component: CaptchaImage;
  let fixture: ComponentFixture<CaptchaImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptchaImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptchaImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
