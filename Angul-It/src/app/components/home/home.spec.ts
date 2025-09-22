import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Home } from './home';

// A "test suite" for the Home component
describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  // This setup code runs before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Provides a mock router
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Render the component's HTML
  });

  // Test 1: The default test that checks if the component is created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Our new test to check for the button
  it('should contain a "Start Challenge" button', () => {
    // fixture.nativeElement gives us access to the component's HTML
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    
    // We expect to find a button, and for its text to include 'Start Challenge'
    expect(button).toBeTruthy();
    expect(button?.textContent).toContain('Start Challenge');
  });
});