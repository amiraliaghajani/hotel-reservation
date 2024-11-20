import { Component, signal } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentInterface } from '../../interface/comment';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormControl, 
  FormGroup,
 Validators,
ReactiveFormsModule ,
AbstractControl,
FormsModule,
FormBuilder
} from '@angular/forms';

import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommentService } from '../../services/comment.service';
@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSliderModule,
    MatButtonModule,
    FlexLayoutModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule
    
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  // comment: string = ''; 
  // rating: number | null = null;
  form!: FormGroup;
  currentRating: number = 1;
  stars: number[] = [1, 2, 3, 4, 5];
  hotelId: number | null = null;
  userId: number | null = null
  protected readonly value = signal('');
  
  ngOnInit(): void {
   
    this.form.get('rating')?.valueChanges.subscribe((value) => {
      this.currentRating = value;
    });

    this.updateStars();

    this.commentService.hotelId$.subscribe((id) => {
      this.hotelId = id; // Get the hotelId from the service
      console.log('Current hotelId:', this.hotelId); // Use it as needed
    });

    this.commentService.userId$.subscribe((id) => {
      this.userId = id; // Get the userId from the service
      console.log('Current userId:', this.userId); // Use it as needed
    });

  }


  constructor(private commentService:CommentService, private fb: FormBuilder,) {
    this.form = this.fb.group({
      comment: ['', {
        validators: [ Validators.required , Validators.maxLength(200)],
      }], 
     
      title: ['',{
        validators: [ Validators.required , Validators.maxLength(50)],
      }], 
      rating: [1, Validators.required], 
    });
  }




updateStars(): void {
    this.currentRating = this.form.get('rating')?.value || 1;
  }

  onSubmit() {
    if (this.form.valid && this.hotelId !== null && this.userId !== null) {
      const comment: CommentInterface = { // Use HotelComment here
        commentId: Math.floor(Math.random() * 1000),
        userId: this.userId,
        hotelId: this.hotelId,
        date: new Date(),
        status: 'pending',
        stars: this.form.get('rating')?.value,
        title: this.form.get('title')?.value,
        description: this.form.get('comment')?.value,
      };
      
      this.commentService.addComment(comment).subscribe({
        next: (response) => {
          console.log('Comment added successfully:', response);
          this.form.reset({ rating: 1 });
          this.form.untouched;
        },
        error: (error) => {
          console.error('Error adding comment:', error);
        }
      });
    } else {
      console.error('Please fill out both fields.', this.hotelId, this.userId);

    }
  }


  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }



}
