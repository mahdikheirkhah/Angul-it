import { Component, OnInit } from '@angular/core'; // Import OnInit
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import form tools
// Define a "shape" for our image objects for type safety
interface CaptchaImage {
  src: string;
  alt: string;
  selected: boolean;
}

@Component({
  selector: 'app-captcha',
  standalone: true, // This component manages its own dependencies
  imports: [CommonModule, ReactiveFormsModule], // Import CommonModule here
  templateUrl: './captcha.html',
  styleUrl: './captcha.css'
})
export class Captcha implements OnInit {
  captchaForm!: FormGroup;
  // Our challenge data
  challenge = {
    prompt: 'Please select all images containing a mountain.',
    images: [
      { src: 'https://placehold.co/150x150/f2f2f2/000?text=Mountain', alt: 'Mountain 1', selected: false },
      { src: 'https://placehold.co/150x150/f2f2f2/000?text=Car', alt: 'Car 1', selected: false },
      { src: 'https://placehold.co/150x150/f2f2f2/000?text=Mountain', alt: 'Mountain 2', selected: false },
      { src: 'https://placehold.co/150x150/f2f2f2/000?text=Beach', alt: 'Beach 1', selected: false },
      { src: 'https://placehold.co/150x150/f2f2f2/000?text=Mountain', alt: 'Mountain 3', selected: false },
      { src: 'https://placehold.co/150x150/f2f2f2/000?text=Tree', alt: 'Tree 1', selected: false },
      { src: 'https://placehold.co/150x150/f2f2f2/000?text=Car', alt: 'Car 2', selected: false },
      { src: 'https://placehold.co/150x150/f2f2f2/000?text=Beach', alt: 'Beach 2', selected: false },
      { src: 'https://placehold.co/150x150/f2f2f2/000?text=Mountain', alt: 'Mountain 4', selected: false },
    ] as CaptchaImage[]
  };
constructor(private fb: FormBuilder) {}

  // 2. Set up the form when the component initializes
  ngOnInit(): void {
    this.captchaForm = this.fb.group({
      selections: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  toggleSelection(image: CaptchaImage): void {
    image.selected = !image.selected;
    this.updateFormSelections(); // 3. Update the form when a selection changes
  }

  private updateFormSelections(): void {
    // 4. Get all currently selected images
    const selectedImages = this.challenge.images.filter(img => img.selected);
    // 5. Update the value of the 'selections' form control
    this.captchaForm.controls['selections'].setValue(selectedImages);
  }

  onSubmit(): void {
    if (this.captchaForm.valid) {
      console.log('Form Submitted!', this.captchaForm.value);
      // We will add navigation logic here later
    }
  }
}
