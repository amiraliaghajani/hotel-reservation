import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  interval,
  Observable,
  startWith,
  Subject,
  switchMap,
  timer,
} from 'rxjs';
export interface SlideInterface {
  url: string;
  title: string;
}
@Component({
  selector: 'image-slider',
  standalone: true,
  imports: [
    
    CommonModule,
  
  ],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.css'
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  @Input() hotelData!: { name: string; image_url: string[] }; // Full hotel data object input
  slides: SlideInterface[] = [];
  currentIndex: number = 0;
  timeoutId?: number;

  ngOnInit(): void {
    // Transform the data into SlideInterface format for the slider
    this.slides = this.hotelData.image_url.map((url: string) => ({
      url: `assets/images/${url}`, // Adjust path if needed
      title: this.hotelData.name
    }));
    
    // Start the automatic slide rotation
    this.resetTimer();
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
  }

  resetTimer() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    // Set a timeout for the next slide
    this.timeoutId = window.setTimeout(() => this.goToNext(), 3000);
  }

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    this.currentIndex = isFirstSlide ? this.slides.length - 1 : this.currentIndex - 1;
    this.resetTimer(); // Reset timer after user action
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.slides.length - 1;
    this.currentIndex = isLastSlide ? 0 : this.currentIndex + 1;
    this.resetTimer(); // Reset timer after user action
  }

  goToSlide(slideIndex: number): void {
    this.currentIndex = slideIndex;
    this.resetTimer(); // Reset timer after user action
  }

  getCurrentSlideUrl(): string {
    return `url('${this.slides[this.currentIndex].url}')`;
  }
}
