import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ReservationFormComponent } from '../reservation-form/reservation-form.component';
import { CalendarForSelectedHotelComponent } from '../../dialog/calendar-for-selected-hotel/calendar-for-selected-hotel.component';
import { ImageSliderComponent } from '../../image-slider/image-slider.component';
import { CommentComponent } from '../../comment-section/comment/comment.component';
import { LoadingSelectedHotelComponent } from '../../dialog/loading-selected-hotel/loading-selected-hotel.component';

import { ToomanCurrencyPipe } from '../../pipe/tooman-currency.pipe';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { CommentService } from '../../services/comment.service';
import { HotelService } from '../hotel.service';

import { HotelProduct } from '../../interface/hotel-product';
import { CommentInterface } from '../../interface/comment';

import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MatCalendar,
  MatDatepickerModule,
  MatRangeDateSelectionModel,
} from '@angular/material/datepicker'
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { LoadingSignalService } from '../../services/UI/loading-signal.service';

@Component({
  selector: 'app-selected-hotel',
  standalone: true,
  imports: [
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FlexLayoutModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReservationFormComponent,
    CalendarForSelectedHotelComponent,
    MatGridListModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterModule,
    ToomanCurrencyPipe,
    ImageSliderComponent,
    CommentComponent,
    LoadingSelectedHotelComponent

  ],
  providers:[
    DefaultMatCalendarRangeStrategy, MatRangeDateSelectionModel
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
  templateUrl: './selected-hotel.component.html',
  styleUrl: './selected-hotel.component.css'
})
export class SelectedHotelComponent  implements OnInit{
  @ViewChild('calendar') calendar: MatCalendar<Date> | undefined;
  selectedDateRange: DateRange<Date> | undefined;
  minDate: Date | undefined;
  product: HotelProduct | null = null;
  products: HotelProduct[] = []
  filteredProducts: HotelProduct[] = []
  hotel!: HotelProduct | undefined;
  loading = false;
  commentSection: any = null;
  showComment$!: Observable<CommentInterface[]>;
  hotelId!: number;
  index = 0;
  slidePerView = 1;
  initialized = false;
  mainImageIndex: number = 0;
  displayedThumbnails: string[] = [];
  isModalOpen = false;
  isModalImageOpen = false;
  selectedImage: string | null = null;

  loadingSignalService= inject(LoadingSignalService)
  isLoading$: Observable<boolean>;


constructor(
  private readonly selectionModel: MatRangeDateSelectionModel<Date>,
  private readonly selectionStrategy: DefaultMatCalendarRangeStrategy<Date>,
  private dateAdapter: DateAdapter<Date>,
  private hotelService: HotelService,
  private route: ActivatedRoute,
    private router: Router,
private commentService:CommentService,
public dialog: MatDialog,
      ){

        this.isLoading$ = this.loadingSignalService.loading$;
    this.minDate = this.dateAdapter.today();
  }




  ngOnInit(): void {
this.route.paramMap.pipe(
  map(
    (parmas) => Number (parmas.get('id'))
  ),
  tap(
    (hotelId) => this.hotelId = hotelId
  ),switchMap(
    (hotelId) => this.hotelService.fetchDataFromApi()
    .pipe(
      map(
        (data) => {
          this.products = data;
          return data.find( 
            (product) => product.id === hotelId
          )
        }
      ),
      tap(
        (hotel) => {
          if (hotel) {
            this.commentService.setHotelId(hotel.id);
          } else {
            console.error('Hotel Not Found')
          }
        }
      ),
      catchError(
        (error) => {
          console.error('Error Fetching Hotel Information', error);
          return of(null);
        }
      )
     )
   )
).subscribe(
  (hotel) => {
    this.hotel = hotel || undefined
  }
)



    // this.commentService.getCommentsByHotelId(this.hotelId).subscribe({
    //   next: (comments) => {
    //     this.showComment = comments;
    //   },
    //   error: (error) => {
    //     console.error('Error fetching comments:', error);
    //   }
    // });
    this.showComment$ =this.commentService.getCommentsByHotelId(this.hotelId)
    this.updateThumbnails();

    



  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  openImageModal(): void {
    
    this.isModalImageOpen = true;
  }

  closeImageModal(): void {
    this.isModalImageOpen = false;
    this.selectedImage = null;
  }



  
  updateThumbnails(): void {
    if (this.hotel?.image_url && this.hotel.image_url.length > 0) {
      this.displayedThumbnails = this.hotel.image_url.slice(this.mainImageIndex + 1, this.mainImageIndex + 5);
    } else {
      this.displayedThumbnails = [];
    }
  }

  onSlideChange(event: any): void {
    this.mainImageIndex = event.activeIndex;
    this.updateThumbnails();
  }

  
  



  rangeChanged(selectedDate: Date) {
    const selection = this.selectionModel.selection,
      newSelection = this.selectionStrategy.selectionFinished(
        selectedDate,
        selection
      );

    this.selectionModel.updateSelection(newSelection, this);
    this.selectedDateRange = new DateRange<Date>(
      newSelection.start,
      newSelection.end
    );
  }

  selectPreset(presetDateRange: { start: Date; end: Date }) {
    this.selectedDateRange = new DateRange<Date>(
      presetDateRange.start,
      presetDateRange.end
    );

    if (presetDateRange.start && this.calendar)
      this.calendar._goToDateInView(presetDateRange.start, 'month');
  }
  submitDateRange() {
    if (this.selectedDateRange) {
      const startDate = this.selectedDateRange.start;
      const endDate = this.selectedDateRange.end;
      console.log('Selected Date Range:', startDate, endDate);
    } else {
      console.log('No date range selected.');
    }
  };
  
  loadCommentSection() {
    this.loading = true;
    setTimeout(() => {
      import('../../comment-section/comment/comment.component').then(({ CommentComponent }) => {
        this.commentSection = CommentComponent;
        this.loading = false;
      });
    }, 1000);
  }
  getAverageStars(comments: CommentInterface[]): number {
    if (!comments || comments.length === 0) {
      return 0; 
    }

    const totalStars = comments.reduce((sum, comment) => sum + comment.stars, 0);
    return totalStars / comments.length;
  }

}
