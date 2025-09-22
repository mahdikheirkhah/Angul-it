import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interfaces for our SVG elements
interface SvgChar {
  char: string;
  x: number;
  y: number;
  rotate: number;
  color: string;
}

interface SvgLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

interface SvgDot {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}

@Component({
  selector: 'app-captcha-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './captcha-image.html',
  styleUrl: './captcha-image.css'
})
export class CaptchaImage implements OnChanges {
  @Input() text: string = '';

  svgWidth = 200;
  svgHeight = 70;
  
  chars: SvgChar[] = [];
  noiseLines: SvgLine[] = [];
  noiseDots: SvgDot[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] && this.text) {
      this.generateCaptchaImage();
    }
  }

  private generateCaptchaImage(): void {
    this.chars = [];
    this.noiseLines = [];
    this.noiseDots = [];
    
    const colors = ['#e57373', '#81c784', '#64b5f6', '#ffb74d', '#9575cd'];

    const startX = Math.floor(Math.random() * 20) + 10;

    // Generate distorted characters using the vibrant colors
    for (let i = 0; i < this.text.length; i++) {
      this.chars.push({
        char: this.text[i],
        x: startX + i * 25,
        y: Math.floor(Math.random() * 20) + 35,
        rotate: Math.floor(Math.random() * 40) - 20,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Generate noise lines using the same color source
    for (let i = 0; i < 25; i++) {
      this.noiseLines.push({
        x1: Math.random() * this.svgWidth,
        y1: Math.random() * this.svgHeight,
        x2: Math.random() * this.svgWidth,
        y2: Math.random() * this.svgHeight,
        // CHANGE: Use the main colors array
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    // Generate noise dots using the same color source
    for (let i = 0; i < 500; i++) {
        this.noiseDots.push({
            cx: Math.random() * this.svgWidth,
            cy: Math.random() * this.svgHeight,
            r: Math.random() * 1.5,
            // CHANGE: Use the main colors array
            fill: colors[Math.floor(Math.random() * colors.length)]
        });
    }
  }
}