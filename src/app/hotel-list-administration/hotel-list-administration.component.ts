import { Component, inject, OnInit } from '@angular/core';
import { GetAllDataService } from '../services/get-all-data.service';
import { HotelProduct } from '../interface/hotel-product';
import { CommonModule } from '@angular/common';
import { ToomanCurrencyPipe } from "../pipe/tooman-currency.pipe";
import { HotelService } from '../all-available-hotel/hotel.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfrimModalComponent } from './delete-confrim-modal/delete-confrim-modal.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-hotel-list-administration',
  standalone: true,
  imports: [
    CommonModule,
    ToomanCurrencyPipe,
    MatButtonModule,
    MatIconModule
],
  templateUrl: './hotel-list-administration.component.html',
  styleUrl: './hotel-list-administration.component.css'
})
export class HotelListAdministrationComponent implements OnInit{
getAllData= inject(GetAllDataService)
hotelService = inject(HotelService)
hotels:HotelProduct[]=[]
ngOnInit(): void {
  this.hotelService.fetchDataFromApi().subscribe(hotel => {
this.hotels= hotel
  })
}
constructor(private router:Router,
             public dialog: MatDialog

){}

viewDetails(id: number): void {
  this.router.navigate(['/hotellist', id]);
}

bookHotel(id: number): void {
  console.log('Book hotel with ID:', id);
}

deleteHotel(hotel: HotelProduct): void {
  console.log('Attempting to delete hotel:', hotel); 

  const dialogRef = this.dialog.open(DeleteConfrimModalComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('User confirmed deletion');  
      this.hotelService.deleteHotel(hotel.id).subscribe(
        () => {
          console.log('Hotel deleted successfully:', hotel.id);  

          this.loadHotels();  
        },
        (error) => {
          console.error('Error deleting hotel:', error); 
        }
      );
    } else {
      console.log('User cancelled deletion');
    }
  });
}

loadHotels(): void {
  this.hotelService.fetchDataFromApi().subscribe(
    (data) => {
      console.log('Hotels data loaded:', data); 
      this.hotels = data; 
    },
    (error) => {
      console.error('Error loading hotels:', error); 
    }
  );
}
addHotel(){
  this.router.navigate(['hotellist/newhotel',]);

}

}
