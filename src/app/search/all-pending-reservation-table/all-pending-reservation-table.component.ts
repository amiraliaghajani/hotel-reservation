import { Component, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Reservation } from '../../interface/reservation';
import { GetAllDataService } from '../../services/get-all-data.service';
import { UserType } from '../../interface/user-type';
import { HotelProduct } from '../../interface/hotel-product';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import { JalaliMomentPipe } from "../../pipe/jalali-moment.pipe";
import { ToomanCurrencyPipe } from "../../pipe/tooman-currency.pipe";



@Component({
  selector: 'app-all-pending-reservation-table',
  standalone: true,
  imports: [
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    CommonModule,
    MatExpansionModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    DatePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAccordion,
    MatSelectModule,
    JalaliMomentPipe,
    ToomanCurrencyPipe
],
  templateUrl: './all-pending-reservation-table.component.html',
  styleUrl: './all-pending-reservation-table.component.css'
})
export class AllPendingReservationTableComponent implements OnInit{
  reservations: Reservation[] = [];
  users: UserType[] = [];
hotels:HotelProduct[] = []
reservationWithHotels: any[] = [];
readonly panelOpenState = signal(false);
matchingUsers: UserType[] = [];
reservationsForUser: Reservation[] = [];
filteredReservations: Reservation[] = [];
selectedStatus: string = '';


  constructor (private getAllService:GetAllDataService) {}
  
  
  
  ngOnInit(): void {
    this.getAllService.getReservations().subscribe(
      (data: Reservation[]) => {
        this.reservations = data;
        this.reservationsForUser = data;
        console.log(this.reservations); 
      },
      error => {
        console.error('Error fetching reservation data', error);
      }
    );
    this.getAllService.getUsers().subscribe(
      (data: UserType[]) => {
        this.users = data;
        console.log(this.users);
      },
      error => {
        console.error('Error fetching user data', error);
      }
    );
    this.getAllService.fetchDataFromHotel().subscribe(
      (data: HotelProduct[]) => {
        this.hotels = data;
        console.log(this.hotels); 
        this.mapReservationsToHotels();
        console.log(this.mapReservationsToHotels)
      }
    );

    this.getAllService.getMatchingUsers().subscribe(users => {
      this.matchingUsers = users;
      console.log('Matching Users:', this.matchingUsers);
    });

  }

  getReservationsForHotel(hotelId: number): Reservation[] {
    return this.reservationWithHotels.filter(reservation => reservation.hotelId === hotelId);
  }

  getReservationsForUser(userId: number): Reservation[] {
    return this.reservationsForUser.filter(reservation => reservation.user?.id === userId);
  }


  mapReservationsToHotels() {
    this.reservationWithHotels = this.reservations.map(reservation => {
      const hotel = this.hotels.find(h => h.id === reservation.hotelId);
      return {
        ...reservation,
        hotel: hotel || null 
      };
    }
  );
  }

  rejectReservation(reservation: Reservation) {
    reservation.status = 'rejected'; 
    this.updateReservation(reservation); 
  }

  approveReservation(reservation: Reservation) {
    reservation.status = 'apporoved'; 
    this.updateReservation(reservation); 
  }
  updateReservation(reservation: Reservation) {
    this.getAllService.updateReservation(reservation).subscribe({
      next: (response) => {
        console.log('reservation updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating reservation:', error);
      }
    });
  }

 


}
