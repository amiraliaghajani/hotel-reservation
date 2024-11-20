import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, computed, ElementRef, NgZone, OnInit, Renderer2, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar, MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { CalendarForm } from '../interface/calendar-form';
import { GetAllDataService } from '../services/get-all-data.service';
import moment from 'moment-jalaali';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';

import { HttpClient } from '@angular/common/http';
import { JalaliDateAdapter } from '../services/jalali-date-adapter';
import { ImageSliderComponent, SlideInterface } from '../image-slider/image-slider.component';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router'
import { CustomSidenavComponent } from '../navagation/custom-sidenav/custom-sidenav.component';
import { Store } from '@ngrx/store';
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
  selector: 'app-test4',
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
    FlexLayoutModule,
    ImageSliderComponent,
    MatSidenavModule,
    MatToolbarModule,
    RouterOutlet,
    CustomSidenavComponent
  ],
  templateUrl: './test4.component.html',
  styleUrl: './test4.component.scss',
  providers: [
    { provide: DateAdapter, useClass: JalaliDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: JALALI_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' }, 
    provideNativeDateAdapter()
  ],
  encapsulation: ViewEncapsulation.None,

})
export class Test4Component{
 


}



// profilePictureUrl