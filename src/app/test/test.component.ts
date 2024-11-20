import { ChangeDetectorRef, Component, model, NgZone, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {MatCalendarCellClassFunction, MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {DatePipe} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {provideNativeDateAdapter} from '@angular/material/core';
import { GetAllDataService } from '../services/get-all-data.service';
import { CalendarForm } from '../interface/calendar-form';
import { JalaliMomentPipe } from '../pipe/jalali-moment.pipe';
import { JalaliDateAdapter } from '../services/jalali-date-adapter';
import moment from 'jalali-moment';
import { ImageSliderComponent } from '../image-slider/image-slider.component';
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




export interface Item {
  name: string;
  price: number;
  description: string;
  availability: string;
}
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [MatExpansionModule,
    MatTableModule,
    MatIconModule,
    CommonModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    JalaliMomentPipe,
    ImageSliderComponent,

  ],
  providers: [
    { provide: DateAdapter, useClass: JalaliDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: JALALI_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' }, 
    provideNativeDateAdapter()
  ],
 
  encapsulation: ViewEncapsulation.None,

  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent implements OnInit{
  reservations: CalendarForm[] = [];
  selectedReservations: CalendarForm[] = [];
  selectedDate: Date | null = null;



  constructor(private getAllDataService: GetAllDataService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private renderer: Renderer2
  ){
  }
  
  ngOnInit(): void {
    this.fetchReservations();
    
  }



  ngAfterViewInit(): void {
    this.cdr.detectChanges();  // Make sure the view is initialized
  }



  fetchReservations(): void {
    this.getAllDataService.getCalendar().subscribe((response: any) => {
      console.log('API Response:', response);
      this.zone.run(() => {
        this.reservations = response.reservations || [];
        this.cdr.markForCheck();
        this.addProfileImagesToDate();

      });
    });
  }
  dateSelected(selectedDate: Date | null): void {
    if (!selectedDate) {
      return; // If no date is selected, just return.
    }

    this.selectedDate = selectedDate;

    // Log selected date in its raw format (Gregorian)
    console.log('Selected date (Gregorian):', selectedDate.toISOString());

    // Convert the selected date from the Jalali calendar to Gregorian
    const selectedDateGregorian = moment(selectedDate).locale('fa').format('YYYY-MM-DD');

    // Filter reservations using Gregorian date
    this.selectedReservations = this.reservations.filter(reservation => {
      const start = moment(reservation.startDay).format('YYYY-MM-DD'); // Ensure start day is in the correct format
      const end = moment(reservation.endDay).format('YYYY-MM-DD'); // Ensure end day is in the correct format
      return selectedDateGregorian >= start && selectedDateGregorian <= end;
    });

    console.log('Selected reservations:', this.selectedReservations);
  }





 dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const cellTime = cellDate.getTime();

      for (const reservation of this.reservations) {
        const start = new Date(reservation.startDay).getTime();
        const end = new Date(reservation.endDay).getTime();

        if (cellTime >= start && cellTime <= end) {
          return 'example-custom-date-class';
        }
      }
    }
    return '';
  };


  addProfileImagesToDate(): void {
    setTimeout(() => {
        const dateCellElements = document.querySelectorAll('.mat-calendar-body-cell');
        console.log('Date Cells Found:', dateCellElements.length); // Should show the count of date cells

        dateCellElements.forEach((element: Element) => {
            const ariaLabel = element.getAttribute('aria-label'); // Get aria-label directly from the cell
            console.log('Cell aria-label:', ariaLabel); // Log each cell's aria-label

            if (ariaLabel) { // Check if ariaLabel is valid
                this.reservations.forEach(reservation => {
                    // Convert reservation start and end days to Jalali
                    const startDateJalali = moment(reservation.startDay).locale('fa').format('jDD jMMMM jYYYY');
                    const endDateJalali = moment(reservation.endDay).locale('fa').format('jDD jMMMM jYYYY');

                    if (ariaLabel === startDateJalali || ariaLabel === endDateJalali) {
                        const cellContent = element.querySelector('.mat-calendar-body-cell-content');

                        // Create img container if it doesn't exist
                        let imgContainer = cellContent?.querySelector('.img-container');
                        if (!imgContainer) {
                            imgContainer = this.renderer.createElement('div');
                            this.renderer.addClass(imgContainer, 'img-container');
                            this.renderer.setStyle(imgContainer, 'position', 'absolute');
                            this.renderer.setStyle(imgContainer, 'bottom', '5px');
                            this.renderer.setStyle(imgContainer, 'left', '5px');
                            this.renderer.setStyle(imgContainer, 'display', 'flex');
                            this.renderer.setStyle(imgContainer, 'gap', '2px');
                            this.renderer.appendChild(cellContent, imgContainer);
                        }

                        // Add profile image
                        const imgElement = this.renderer.createElement('img');
                        this.renderer.setAttribute(imgElement, 'src', 'https://via.placeholder.com/24'); // Placeholder image for testing
                        this.renderer.setStyle(imgElement, 'width', '24px');
                        this.renderer.setStyle(imgElement, 'height', '24px');
                        this.renderer.setStyle(imgElement, 'border-radius', '50%');
                        this.renderer.appendChild(imgContainer, imgElement);
                    }
                });
            } else {
                console.warn('No aria-label found for this cell.');
            }
        });
    }, 100); // Adjust the timeout duration if needed
}

getReservedDates(reservation: CalendarForm): Date[] {
  const startDate = new Date(reservation.startDay); // Convert startDay to a Date object
  const endDate = new Date(reservation.endDay); // Convert endDay to a Date object
  const dates = [];

  // Loop from startDate to endDate, pushing each date into the array
  for (let dt = startDate; dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      dates.push(new Date(dt)); // Push a new Date object to avoid reference issues
  }

  return dates; // Return the array of dates
}


}


