import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import moment from 'moment-jalaali';



import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Reservation } from '../../interface/reservation';
import { JalaliDateAdapter } from '../../services/jalali-date-adapter';
import { ActivatedRoute, Router } from '@angular/router';


// export const JALALI_DATE_FORMATS = {
//   parse: {
//     dateInput: 'YYYY/MM/DD',
//   },
//   display: {
//     dateInput: 'YYYY/MM/DD',
//     monthYearLabel: 'MMMM YYYY',
//     dateA11yLabel: 'YYYY/MM/DD',
//     monthYearA11yLabel: 'MMMM YYYY',
//   }
// };


@Component({
  selector: 'app-calendar-for-selected-hotel',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    FlexLayoutModule


  ],
  providers: [
    { provide: DateAdapter, useClass: JalaliDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: JALALI_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' }, 
    provideNativeDateAdapter()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendar-for-selected-hotel.component.html',
  styleUrl: './calendar-for-selected-hotel.component.css'
})
export class CalendarForSelectedHotelComponent {
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
  dateRanges: Date[][] = [];
  jalaliDateRanges: any[][] = [];
  reservations: {
     profilePictureUrl: string, 
     startDay: Date,
      endDay: Date,
       jalaliStart: string, 
       jalaliEnd: string ,
       originalData: any,
       hotelId:number
      } [] = [];
      selectedReservations: any[] = [];
      visibleDates: string[] = [];
      allDataForReservation:Reservation[]=[]
      matchingReservations: any[] = [];
      selectedDate: Date | null = null;
    apiUrl = 'http://localhost:3006';
    selectedHotelId: number | null = null;
    @Output() close = new EventEmitter<void>();

  
  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
   private route: ActivatedRoute,
   private router: Router,

  ) {

    this.fetchDataForReservation()
this.addProfilePictures()


  }
  











  ngOnInit(): void {
    
   

}

      ngAfterViewInit(): void {
        this.cdr.detectChanges();
        console.log("View checked, adding profile pictures...");
        this.addProfilePictures();
      }



      fetchDataForReservation() {
        this.http.get<any[]>(this.apiUrl).subscribe(
          (data) => {
            console.log('Fetched Data:', data); 
            // Retrieve the selectedHotelId from the route params
            this.route.paramMap.subscribe((params) => {
              const id = params.get('id'); 
              if (id) {
                this.selectedHotelId = +id;  // Convert id to a number
                console.log('Selected Hotel ID:', this.selectedHotelId);
              } 
            });
      
            // Process the fetched data
            const transformedReservations = data.map(item => {
              const startDay = new Date(item.dateRange[0]); 
              const endDay = new Date(item.dateRange[1]);   
        
              const jalaliStart = this.convertToJalali(startDay);
              const jalaliEnd = this.convertToJalali(endDay);
        
              return {
                profilePictureUrl: item.user.profilePictureUrl,
                startDay: startDay, 
                endDay: endDay,   
                jalaliStart: jalaliStart,  
                jalaliEnd: jalaliEnd,
                originalData: item,
                hotelId: item.hotelId  // Ensure you're accessing hotelId correctly
              };
            });
      
            // Filter reservations by hotelId
            this.reservations = transformedReservations.filter(reservation => {
              console.log(`Reservation Hotel ID: ${reservation.hotelId}, Selected Hotel ID: ${this.selectedHotelId}`); // Debugging output
              return reservation.hotelId === +this.selectedHotelId!; // Use + to convert selectedHotelId to a number
            });
                  
            // Log the filtered reservations
            console.log('Filtered Reservations with Jalali Dates:', this.reservations);
            
            // Detect changes if necessary
            this.cdr.detectChanges(); 
            this.addProfilePictures();
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
  
    this.selectedReservations = this.reservations.filter(reservation => {
      const start = new Date(reservation.startDay);
      const end = new Date(reservation.endDay);
      return selectedDate >= start && selectedDate <= end;
    });
   
    this.addProfilePictures()

  }


  onClose(): void {
    this.close.emit();
  }
}