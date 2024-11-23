import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  effect,
} from '@angular/core';
import { Observable } from 'rxjs';
import { SwiperContainer } from 'swiper/element/bundle';
import { CommonModule, JsonPipe } from '@angular/common';
import moment from 'moment-jalaali';



import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { JalaliDateAdapter } from '../services/jalali-date-adapter';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Reservation } from '../interface/reservation';










interface User {
  id: number;
  name: string;
  price: number;
  image_url: string[]; // Ensure this is defined as an array of strings
  description: string;
}




@Component({
  selector: 'app-test5',
  standalone: true,
  imports: [CommonModule,
    MatExpansionModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
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
  templateUrl: './test5.component.html',
  styleUrl: './test5.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: DateAdapter, useClass: JalaliDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' }, 
    provideNativeDateAdapter()
  ],
  encapsulation: ViewEncapsulation.None,
})
export class Test5Component {
  dateRanges: Date[][] = [];
  jalaliDateRanges: any[][] = [];
  reservations: {
     profilePictureUrl: string, 
     startDay: Date,
      endDay: Date,
       jalaliStart: string, 
       jalaliEnd: string ,
       originalData: any
      } [] = [];
    selectedDate: Date | null = null;
    selectedReservations: any[] = [];
    @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
   apiUrl = 'http://localhost:3006';
   visibleDates: string[] = [];
allDataForReservation:Reservation[]=[]
matchingReservations: any[] = [];


  
  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}
  











  ngOnInit(): void {
    this.fetchData();
        this.fetchDataForReservation();
        this.getVisibleDates()
        
          this.addProfilePictures();
        
        
      }
      ngAfterViewInit(): void {
        this.getVisibleDates(); // Call this first to populate visibleDates
        this.cdr.detectChanges();
        console.log("View checked, adding profile pictures...");
        this.addProfilePictures();
      }



  fetchDataForReservation() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        
        this.reservations = data.map(item => {
          const startDay = new Date(item.dateRange[0]); // Start date (Gregorian)
          const endDay = new Date(item.dateRange[1]);   // End date (Gregorian)
  
          // Convert to Jalali
          const jalaliStart = this.convertToJalali(startDay);
          const jalaliEnd = this.convertToJalali(endDay);
  
          return {
            profilePictureUrl: item.user.profilePictureUrl,
            startDay: startDay,  // Gregorian start date
            endDay: endDay,      // Gregorian end date
            jalaliStart: jalaliStart,  // Jalali start date as a string
            jalaliEnd: jalaliEnd  ,
            originalData: item,

          };
        });
  
        console.log('Extracted Reservations with Jalali Dates:', this.reservations);
        console.log(this.reservations)
       
        // After fetching data, you can add profile pictures to the calendar
        this.cdr.detectChanges(); // Force view refresh
        this.addProfilePictures();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  fetchData() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.dateRanges = data.map(item => [
          new Date(item.dateRange[0]),
          new Date(item.dateRange[1])
        ]);
        console.log('Extracted Date Ranges:', this.dateRanges);

        // Convert to Jalali and store in the new variable
        this.jalaliDateRanges = this.dateRanges.map(range => [
          moment(range[0]).locale('fa').format('YYYY/MM/DD'),
          moment(range[1]).locale('fa').format('YYYY/MM/DD')
        ]);
        console.log('Jalali Date Ranges:', this.jalaliDateRanges);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }


  convertToJalali(date: Date | null | undefined): string {
    if (!date) return '';
    
    // Convert the date to Jalali using `jMoment`
    return moment(date).locale('fa').format('jYYYY/jMM/jDD');
  }
  
  getVisibleDates(): void {
    const currentMonth = moment().jMonth();
    const currentYear = moment().jYear();
    const daysInMonth = moment.jDaysInMonth(currentYear, currentMonth);
  
    console.log("Generating visible dates...");
    this.visibleDates = Array.from({ length: daysInMonth }, (_, i) => 
      moment(`${currentYear}/${currentMonth + 1}/${i + 1}`, 'jYYYY/jMM/jDD')
        .format('jYYYY/jMM/jDD')
    );
  
    console.log("Visible Dates:", this.visibleDates); // Log visible dates
  }





  parseAriaLabelToJalali(ariaLabel: string): string {
    // Example aria-label format: "۱۰ آبان ۱۴۰۳"
    const parts = ariaLabel.split(' '); // Split by space
    const day = parts[0];   // Get day
    const month = parts[1]; // Get month (e.g., "آبان")
    const year = parts[2];  // Get year
  
    // Convert month name to its corresponding number (1-based)
    const monthMap: { [key: string]: number } = {
      'فروردین': 1,
      'اردیبهشت': 2,
      'خرداد': 3,
      'تیر': 4,
      'مرداد': 5,
      'شهریور': 6,
      'مهر': 7,
      'آبان': 8,
      'آذر': 9,
      'دی': 10,
      'بهمن': 11,
      'اسفند': 12
    };
  
    const monthNumber = monthMap[month] || 0; // Get the month number
    return `${year}/${monthNumber.toString().padStart(2, '0')}/${day.padStart(2, '0')}`; // Format as 'jYYYY/jMM/jDD'
  }





  compareDatesWithReservations(): void {
    // console.log("Comparing visible dates with reservations...");
    
    this.visibleDates.forEach(date => {
      const visibleMoment = moment(date, 'jYYYY/jMM/jDD');
  
      if (this.reservations && this.reservations.length > 0) {
        this.reservations.forEach(reservation => {
          const startMoment = moment(reservation.jalaliStart, 'jYYYY/jMM/jDD');
          const endMoment = moment(reservation.jalaliEnd, 'jYYYY/jMM/jDD');
  
          const isInRange = visibleMoment.isBetween(startMoment, endMoment, undefined, '[]');
  
          // console.log(`Checking date ${date}:`);
          // console.log(`- Start: ${reservation.jalaliStart} (${startMoment.format('jYYYY/jMM/jDD')})`);
          // console.log(`- End: ${reservation.jalaliEnd} (${endMoment.format('jYYYY/jMM/jDD')})`);
          // console.log(`- In Range: ${isInRange}`);
  
          if (isInRange) {
            console.log(`Date ${date} is within the reservation range!`);
          }
        });
      } else {
        console.log("No reservations to compare.");
      }
    });
  }
  addProfilePictures(): void {
    const calendarCells: NodeListOf<Element> = this.el.nativeElement.querySelectorAll('.reserved-date');

    if (calendarCells.length === 0) {
      console.log("No reserved cells found yet.");
      return;
    }

    // console.log(`Found reserved cells: ${calendarCells.length}`);

    calendarCells.forEach((cell: Element) => {
      const cellAsHTMLElement = cell as HTMLElement; 
      const ariaLabel = cellAsHTMLElement.getAttribute('aria-label'); 

      if (ariaLabel) {
        const dateString = this.parseAriaLabelToJalali(ariaLabel); 
        const reservationsForDate = this.getReservationsForDate(dateString); // Get all reservations for the date

        // console.log(`Processing date: ${dateString}`, reservationsForDate); // Debug log to check reservations

        // Clear existing images and count before adding new ones
        this.clearExistingImages(cellAsHTMLElement);

        if (reservationsForDate.length > 0) {
          const maxImagesToShow = 3;
          const imagesToShow = reservationsForDate.slice(0, maxImagesToShow);
          
          imagesToShow.forEach(reservation => {
            const img = this.renderer.createElement('img');
            this.renderer.setAttribute(img, 'src', reservation.profilePictureUrl);
            this.renderer.addClass(img, 'profile-picture'); 

            // Append the image to the cell
            this.renderer.appendChild(cellAsHTMLElement, img);
          });

          // If there are more than 3 reservations, show the count
          if (reservationsForDate.length > maxImagesToShow) {
            const remainingCount = reservationsForDate.length - maxImagesToShow;
            const countText = this.renderer.createText(`+${remainingCount} more`);
            
            // Create a span for the count text to apply styles
            const countContainer = this.renderer.createElement('span');
            this.renderer.addClass(countContainer, 'remaining-count');
            this.renderer.appendChild(countContainer, countText);
            
            this.renderer.appendChild(cellAsHTMLElement, countContainer);
          }

          // console.log(`Added profile pictures for date ${dateString}`);
        }
      }
    });
  }
  
  
  getReservationsForDate(dateString: string): any[] {
    // Convert Persian numerals to English numerals for comparison
    const convertedDateString = this.convertPersianToEnglishNumerals(dateString);
  
    return this.reservations.filter(reservation => {
      // Ensure jalaliStart and jalaliEnd are in the same format as convertedDateString
      const startDate = this.convertPersianToEnglishNumerals(reservation.jalaliStart);
      const endDate = this.convertPersianToEnglishNumerals(reservation.jalaliEnd);
  
      console.log(`Comparing ${convertedDateString} with ${startDate} and ${endDate}`); // Log for debugging
  
      return startDate <= convertedDateString && endDate >= convertedDateString;
    });
  }
  onMonthChange(): void {
    console.log("Month changed, adding profile pictures again...");
    this.addProfilePictures();
  }
  clearExistingImages(cell: HTMLElement): void {
    // Remove existing profile pictures and count
    const images = cell.querySelectorAll('img.profile-picture');
    images.forEach(img => this.renderer.removeChild(cell, img));

    const count = cell.querySelector('span.remaining-count');
    if (count) {
      this.renderer.removeChild(cell, count);
    }
  }



  convertPersianToEnglishNumerals(persianDate: string): string {
  const persianNumerals = '۰۱۲۳۴۵۶۷۸۹';
  const englishNumerals = '0123456789';
  
  return persianDate.replace(/[۰-۹]/g, (char) => englishNumerals[persianNumerals.indexOf(char)]);
}

  
  
  
  
  








  

  dateClass = (date: Date): string => {
    const jalaliDate = this.convertToJalali(date);
    const hasReservation = this.reservations.some(reservation => {
      return jalaliDate >= reservation.jalaliStart && jalaliDate <= reservation.jalaliEnd;
    });
    return hasReservation ? 'reserved-date' : '';
  };
  
  
  

 
  dateSelected(selectedDate: Date | null): void {
    if (!selectedDate) {
      return; // If no date is selected, just return.
    }

    this.selectedDate = selectedDate;

    const cell = this.el.nativeElement.querySelector('mat-calendar .mat-calendar-body-cell-selected');
    const ariaLabel = cell ? cell.getAttribute('aria-label') : '';
  
    // Call the method to compare dates with reservations
    this.compareDatesWithReservations();
    this.selectedReservations = this.reservations.filter(reservation => {
      const start = new Date(reservation.startDay);
      const end = new Date(reservation.endDay);
      return selectedDate >= start && selectedDate <= end;
    });
   this. addProfilePictures()
    

  }
  

  
isDateInRange(date: string, start: string, end: string): boolean {
  const dateMoment = moment(date, 'jYYYY/jMM/jDD');
  const startMoment = moment(start, 'jYYYY/jMM/jDD');
  const endMoment = moment(end, 'jYYYY/jMM/jDD');
  return dateMoment.isBetween(startMoment, endMoment, undefined, '[]');
}






}





