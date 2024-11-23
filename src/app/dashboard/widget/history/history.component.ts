import { Component, inject } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { UserType } from '../../../interface/user-type';
import { GetAllDataService } from '../../../services/get-all-data.service';
import { Reservation } from '../../../interface/reservation';
import { forkJoin, map } from 'rxjs';
import { HotelService } from '../../../all-available-hotel/hotel.service';
import { CommonModule } from '@angular/common';
import { JalaliMomentPipe } from "../../../pipe/jalali-moment.pipe";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    JalaliMomentPipe
],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  commentService=inject(CommentService)
  getAllDataService= inject(GetAllDataService)
  hotelService = inject(HotelService)
  currentUser:UserType|null=null
UserReservation:{ 
  reservation:Reservation, 
  hotelName: string,
  userFirstName:string, 
  userLastName:string}[]=[]

  ngOnInit(): void {
    const userFromStorage = localStorage.getItem('currentUser');
    if (userFromStorage) {
      this.currentUser = JSON.parse(userFromStorage) as UserType;
    }
   this.getCombinedData()
    console.log(this.UserReservation)
  }



  getCombinedData(): void {
    console.log('Current User:', this.currentUser); // Debug log
  
    forkJoin({
      hotels: this.hotelService.getAllProducts(),
      reservations: this.getAllDataService.getReservations(),
    })
      .pipe(
        map(({ hotels, reservations }) => {
          console.log('Hotels fetched:', hotels); // Debug log
          console.log('Reservations fetched:', reservations); // Debug log
          return reservations
            .filter((reservation) => reservation.user?.id === this.currentUser?.id)
            .map((reservation) => {
              const hotel = Array.isArray(hotels)
                ? hotels.find((hotel) => hotel.id === reservation.hotelId)
                : null; // Ensure `hotels` is an array
              return {
                reservation,
                hotelName: hotel ? hotel.name : 'Unknown Hotel',
                userFirstName: this.currentUser?.englishFirstName || 'unknown user',
                userLastName: this.currentUser?.englishLastName || 'unknown user',
              };
            });
        })
      )
      .subscribe(
        (combinedData) => {
          console.log('Combined Data:', combinedData);
          this.UserReservation = combinedData;
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    
  }
  





}
