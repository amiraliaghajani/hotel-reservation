import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
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

import { CommonModule, JsonPipe } from '@angular/common';
import moment from 'moment-jalaali';



import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { JalaliDateAdapter } from '../services/jalali-date-adapter';
import { JALALI_DATE_FORMATS } from '../test/test.component';
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

@Component({
  selector: 'app-reservation-calendar',
  standalone: true,
  imports: [
    CommonModule,
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
  templateUrl: './reservation-calendar.component.html',
  providers: [
    { provide: DateAdapter, useClass: JalaliDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: JALALI_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' }, 
    provideNativeDateAdapter()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './reservation-calendar.component.css'
})
export class ReservationCalendarComponent {
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
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
      selectedReservations: any[] = [];
      visibleDates: string[] = [];
      allDataForReservation:Reservation[]=[]
      matchingReservations: any[] = [];
      selectedDate: Date | null = null;
    apiUrl = 'http://localhost:3006';


  
  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}
  











  ngOnInit(): void {
    this.fetchData();
        this.fetchDataForReservation();
        this.getVisibleDates()
        
          this.addProfilePictures();
        
        
      }
      ngAfterViewInit(): void {
        this.getVisibleDates(); 
        this.cdr.detectChanges();
        console.log("View checked, adding profile pictures...");
        this.addProfilePictures();
      }



  fetchDataForReservation() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        
        this.reservations = data.map(item => {
          const startDay = new Date(item.dateRange[0]); 
          const endDay = new Date(item.dateRange[1]);   
  
          const jalaliStart = this.convertToJalali(startDay);
          const jalaliEnd = this.convertToJalali(endDay);
  
          return {
            profilePictureUrl: item.user.profilePictureUrl,
            startDay: startDay, 
            endDay: endDay,   
            jalaliStart: jalaliStart,  
            jalaliEnd: jalaliEnd  ,
            originalData: item,

          };
        });
  
        console.log('Extracted Reservations with Jalali Dates:', this.reservations);
        console.log(this.reservations)
       
        this.cdr.detectChanges(); 
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
  
    console.log("Visible Dates:", this.visibleDates); 
  }





  parseAriaLabelToJalali(ariaLabel: string): string {
    const parts = ariaLabel.split(' ');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];  
  
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
  
    const monthNumber = monthMap[month] || 0; 
    return `${year}/${monthNumber.toString().padStart(2, '0')}/${day.padStart(2, '0')}`;
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

        this.clearExistingImages(cellAsHTMLElement);

        if (reservationsForDate.length > 0) {
          const maxImagesToShow = 3;
          const imagesToShow = reservationsForDate.slice(0, maxImagesToShow);
          
          imagesToShow.forEach(reservation => {
            const img = this.renderer.createElement('img');
            this.renderer.setAttribute(img, 'src', reservation.profilePictureUrl);
            this.renderer.addClass(img, 'profile-picture'); 

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
          this.cdr.detectChanges();

          // console.log(`Added profile pictures for date ${dateString}`);
        }
      }
    });
  }
  
  
  getReservationsForDate(dateString: string): any[] {
    const convertedDateString = this.convertPersianToEnglishNumerals(dateString);
  
    return this.reservations.filter(reservation => {
      const startDate = this.convertPersianToEnglishNumerals(reservation.jalaliStart);
      const endDate = this.convertPersianToEnglishNumerals(reservation.jalaliEnd);
  
      console.log(`Comparing ${convertedDateString} with ${startDate} and ${endDate}`);
  
      return startDate <= convertedDateString && endDate >= convertedDateString;
    });
  }
  onMonthChange(): void {
    console.log("Month changed, adding profile pictures again...");
    this.addProfilePictures();
  }
  clearExistingImages(cell: HTMLElement): void {
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
      return; 
    }

    this.selectedDate = selectedDate;

    const cell = this.el.nativeElement.querySelector('mat-calendar .mat-calendar-body-cell-selected');
    const ariaLabel = cell ? cell.getAttribute('aria-label') : '';
  
    this.compareDatesWithReservations();
    this.selectedReservations = this.reservations.filter(reservation => {
      const start = new Date(reservation.startDay);
      const end = new Date(reservation.endDay);
      return selectedDate >= start && selectedDate <= end;
    });
   
    this.addProfilePictures()

  }
  

  
isDateInRange(date: string, start: string, end: string): boolean {
  const dateMoment = moment(date, 'jYYYY/jMM/jDD');
  const startMoment = moment(start, 'jYYYY/jMM/jDD');
  const endMoment = moment(end, 'jYYYY/jMM/jDD');
  return dateMoment.isBetween(startMoment, endMoment, undefined, '[]');
}






}