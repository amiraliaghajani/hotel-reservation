import { Component ,ChangeDetectionStrategy, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder} from '@angular/forms';

// import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
// import {JsonPipe} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import { CommentService } from '../../services/comment.service';
import { HttpClient } from '@angular/common/http';
import { UserType } from '../../interface/user-type';
import { Reservation } from '../../interface/reservation';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { AbstractControl, ValidatorFn } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDividerModule} from '@angular/material/divider';

import moment from 'jalali-moment';

import { HotelService } from '../hotel.service';
import { ActivatedRoute } from '@angular/router';
import { GetUserService } from '../../services/get-user.service';
import { HotelProduct } from '../../interface/hotel-product';
import { GetAllDataService } from '../../services/get-all-data.service';
import { JalaliDateAdapter } from '../../services/jalali-date-adapter';

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
// export function dateRangeValidator(disabledDates: Date[][]): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     const startDate = control.parent?.get('start')?.value;
//     const endDate = control.parent?.get('end')?.value;

//     if (!startDate || !endDate) {
//       return null;
//     }

//     for (const range of disabledDates) {
//       const rangeStart = new Date(range[0]);
//       const rangeEnd = new Date(range[1]);

//       if ((startDate >= rangeStart && startDate <= rangeEnd) || (endDate >= rangeStart && endDate <= rangeEnd)) {
//         return { dateRangeInvalid: true };
//       }
//     }

//     return null;
//   };
// }




@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    // MatNativeDateModule,
    MatDatepickerModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    // JsonPipe,
    ReactiveFormsModule,
    MatButtonModule,
    FlexLayoutModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDividerModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: JalaliDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: JALALI_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' }, 
    provideNativeDateAdapter()
  ],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


















export class ReservationFormComponent implements OnInit {


 apiUrl = 'http://localhost:3004';
  hotelId: number | null = null;
  userId: number | null = null
users:UserType[]= [];
minDate!: Date;
selectedRange: (Date | null)[] = [];
dateRanges: Date[][] = [];
today= new Date
selectedHotelId: number | null = null;
specificHotel:HotelProduct |null = null


readonly range = new FormGroup({
  start: new FormControl<Date | null>(null,),
  end: new FormControl<Date | null>(null,)
});

testComp=true
isChecked = true
  familyForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required])
  });
  familyMembers: { firstName: string; lastName: string }[] = [];



submitted: Reservation= {
  user: null,
  dateRange: [],
  familyMembers: [],
  status: 'pending',
  reservationId:0,
  hotelId:null,


};




constructor( 
  private commentService:CommentService
   , private http:HttpClient,
   private hotelService:HotelService,
   private route: ActivatedRoute,
   private getUserService:GetUserService,
   private getAllDataService: GetAllDataService,
  //  private dateAdapter: DateAdapter<Date>
  ) {

 
 
  this.range.valueChanges.subscribe(value => {
    const startDate: Date | null = value?.start ?? null;
    const endDate: Date | null = value?.end ?? null;
    this.selectedRange = [startDate, endDate];
    console.log('Jalali Start Date:', this.convertToJalali(startDate));
      console.log('Jalali End Date:', this.convertToJalali(endDate));
  });
}
  ngOnInit(): void {
    this.commentService.hotelId$.subscribe((id) => {
      this.hotelId = id; 
      console.log('Current hotelId:', this.hotelId);
    });

    this.minDate = new Date();
    this.commentService.userId$.subscribe((id) => {
      this.userId = id; 
      console.log('Current userId:', this.userId); 
    });
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id'); 
      if (id) {
        this.selectedHotelId = +id; 
        console.log('Selected Hotel ID:', this.selectedHotelId);
      }
    });


this.fetchDataFromApi()
this.fetchDataForDateRange();
console.log(this.dateRanges)

  }
  unavailableDate(calendarDate: Date):boolean{
    return calendarDate < this.today
  }


  fetchDataFromApi(): void {
    const apiUrl = 'http://localhost:3001'; 
  
    this.http.get<{ DUMMY_Users: UserType[] }>(apiUrl).subscribe(
      (data) => {
        console.log('Fetched Data:', data); 
        if (data.DUMMY_Users) {
          this.users = data.DUMMY_Users;
        } else {
          console.error('No DUMMY_Users found in the response');
        }
      },
      (error) => {
        console.error('Error fetching data from API', error);
      }
    );
  }

  submitData() {
    this.fetchDataFromApi();
    
    if (this.userId !== null && this.users.length > 0) {
      const matchedUser = this.users.find(user => user.id === this.userId);

      if (matchedUser) {
        const reservationId = Math.floor(Math.random() * 1000000);
        this.submitted.user = matchedUser;
        this.submitted.dateRange = this.selectedRange;
        this.submitted.familyMembers = this.familyMembers;
        this.submitted.reservationId = reservationId;
        this.submitted.hotelId = this.selectedHotelId
        console.log('Submitted Data:', this.submitted);

        this.http.post(this.apiUrl, this.submitted).subscribe(
          response => {
            console.log('Data submitted successfully:', response);
          },
          error => {
            console.error('Error submitting data:', error);
          }
        );
      } else {
        console.error('No user found with the given userId');
      }
    } 
  }
  

addFamilyMember() {
  if (this.familyForm.valid) {
    const newMember = {
      firstName: this.familyForm.value.firstName ?? '',
      lastName: this.familyForm.value.lastName ?? ''
    };

    this.familyMembers.push(newMember);

    this.familyForm.reset();
  }
}
removeFamilyMember(index: number) {
  this.familyMembers.splice(index, 1);
}




fetchDataForDateRange() {
  this.http.get<any[]>(this.apiUrl).subscribe(
    (data) => {
      this.dateRanges = data.map(item => [
        new Date(item.dateRange[0]),
        new Date(item.dateRange[1])
      ]);
      console.log('Extracted Date Ranges:', this.dateRanges);
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );
}


myFilter = (date: Date | null): boolean => {
  if (!date) return true;

  return !this.dateRanges.some(([start, end]) => date >= start && date <= end);
};

isActiveDatepicker(){
 return this.getUserService.getCurrentUser()
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


