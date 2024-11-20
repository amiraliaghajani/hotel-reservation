import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import moment from 'jalali-moment';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { FlexLayoutModule } from '@angular/flex-layout';
// import { AbstractControl, ValidatorFn } from '@angular/forms';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { JalaliDateAdapter } from '../services/jalali-date-adapter';
import { HttpClient } from '@angular/common/http';
import { GetAllDataService } from '../services/get-all-data.service';
import { CalendarForm } from '../interface/calendar-form';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, Renderer2, ViewChild, viewChild, ViewEncapsulation } from '@angular/core';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';


import {MatInputModule} from '@angular/material/input';


export const JALALI_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};


@Component({
  selector: 'app-test3',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatTableModule,
    MatIconModule,
    CommonModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    JsonPipe,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    FlexLayoutModule
  ],
  providers: [
    // { provide: DateAdapter, useClass: JalaliDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: JALALI_DATE_FORMATS },
    // { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' }, 
    provideNativeDateAdapter()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './test3.component.html',
  styleUrl: './test3.component.css'
})
export class Test3Component {
  reservations: CalendarForm[] = [];
  selectedReservations: CalendarForm[] = [];
  selectedDate: Date | null = null;
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;


  constructor(private getAllDataService: GetAllDataService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private zone: NgZone,
    private elRef: ElementRef
  ){
  }
  
  ngOnInit(): void {
    this.fetchReservations();
    
  



  }

  ngAfterViewInit(): void {
    this.calendar.stateChanges.subscribe(() => {
      console.log('Calendar view changed'); // Check if the view changes are being detected
      this.addProfilePicturesToCalendar();
    });
  }
  fetchReservations(): void {
    this.getAllDataService.getCalendar().subscribe((response: any) => {
      console.log('Fetched Reservations:', response); // Check if data is coming from API
      this.reservations = response.reservations || [];
      this.calendar.updateTodaysDate();  // Trigger a view refresh
    }, error => {
      console.error('Error fetching reservations:', error); // Handle errors from API
    });
  }
  
  // this.cdr.markForCheck();
  dateSelected(selectedDate: Date | null): void {
    if (!selectedDate) {
      return; // If no date is selected, just return.
    }
    
    this.selectedDate = selectedDate;
    console.log('Selected date:', selectedDate);
  
    this.selectedReservations = this.reservations.filter(reservation => {
      const start = new Date(reservation.startDay);
      const end = new Date(reservation.endDay);
      return selectedDate >= start && selectedDate <= end;
    });
    console.log('Selected reservations:', this.selectedReservations);
  }

  formatDate(date: Date | string): string {
    // Convert Date object to string if necessary
    const dateString = typeof date === 'string' ? date : date.toISOString();
  
    return moment(dateString).locale('fa').format('jYYYY/jM/jD'); // Format to Jalali date
  }
  
  
  // dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
  //   console.log('dateClass triggered for:', cellDate, 'View:', view); // Debug
  
  //   if (view === 'month') {
  //     const cellTime = cellDate.getTime();
      
  //     for (const reservation of this.reservations) {
  //       const start = new Date(reservation.startDay).getTime();
  //       const end = new Date(reservation.endDay).getTime();
        
  //       if (cellTime >= start && cellTime <= end) {
  //         console.log('Highlighting date:', cellDate); // Debug
  //         return 'example-custom-date-class';
  //       }
  //     }
  //   }
  
  //   return '';
  // };

 
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const cellTime = cellDate.getTime();
      for (const reservation of this.reservations) {
        const start = new Date(reservation.startDay).getTime();
        const end = new Date(reservation.endDay).getTime();
        if (cellTime >= start && cellTime <= end) {
          return 'example-custom-date-class';  // This should still apply the pink background
        }
      }
    }
    return '';
  };
 
  



  getReservationsForDate(date: Date): CalendarForm[] {
    return this.reservations.filter(reservation => {
      const start = new Date(reservation.startDay).getTime();
      const end = new Date(reservation.endDay).getTime();
      const cellTime = date.getTime();
      return cellTime >= start && cellTime <= end;
    });
  }
 addProfilePicturesToCalendar(): void {
  setTimeout(() => {
    const calendarCells = this.elRef.nativeElement.querySelectorAll('.mat-calendar-body-cell');

    calendarCells.forEach((cell: HTMLElement) => {
      // Clear previous profile pictures to avoid duplication
      const existingImages = cell.querySelectorAll('.profile-pic, .more-indicator');
      existingImages.forEach(img => img.remove());

      const ariaLabel = cell.getAttribute('aria-label'); 
      const cellDate = new Date(ariaLabel || '');

      if (isNaN(cellDate.getTime())) {
        return; 
      }

      const profileImages = this.getProfilePicturesForDate(cellDate);
      
      const maxImagesToShow = 3;
      const displayedImages = profileImages.slice(0, maxImagesToShow); // Get only the first few images

      displayedImages.forEach(imageUrl => {
        const imgElement = this.renderer.createElement('img');
        this.renderer.setAttribute(imgElement, 'src', imageUrl);
        this.renderer.addClass(imgElement, 'profile-pic');
        this.renderer.appendChild(cell, imgElement);
      });

      
      if (profileImages.length > maxImagesToShow) {
        const moreIndicator = this.renderer.createElement('div');
        this.renderer.addClass(moreIndicator, 'more-indicator');
        this.renderer.setProperty(moreIndicator, 'innerText', `+${profileImages.length - maxImagesToShow}`);
        this.renderer.appendChild(cell, moreIndicator);
      }
    });
  }, 0);
}

  
  

  getProfilePicturesForDate(cellDate: Date): string[] {
    const profileImages: string[] = [];
    const cellTime = cellDate.getTime();

    console.log('Matching profile pictures for date:', cellDate);  // Debug: Check if the date is correct

    for (const reservation of this.reservations) {
      const start = new Date(reservation.startDay).getTime();
      const end = new Date(reservation.endDay).getTime();

      console.log('Checking reservation:', reservation);  // Debug: Check if reservations are correct

      if (cellTime >= start && cellTime <= end) {
        profileImages.push(reservation.profilePictureUrl);  // Assuming profileImage is a valid URL in reservation data
        console.log('Profile image found:', reservation.profilePictureUrl);  // Debug: Log profile image
      }
    }

    return profileImages;
  }
  convertToJalali(date: Date | null | undefined): string {
    if (!date) return '';
    return moment(date).locale('fa').format('YYYY/MM/DD');
  }
  
  // Convert from Jalali to Gregorian for submission
  convertToGregorian(jalaliDate: string): Date | null {
    if (!jalaliDate) return null;
    return moment.from(jalaliDate, 'fa', 'YYYY/MM/DD').toDate();
  }







}



// profilePictureUrl