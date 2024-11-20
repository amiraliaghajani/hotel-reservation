import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';


@Component({
  selector: 'app-loading-selected-hotel',
  standalone: true,
  imports: [
    MatToolbarModule
  ],
  templateUrl: './loading-selected-hotel.component.html',
  styleUrl: './loading-selected-hotel.component.css'
})
export class LoadingSelectedHotelComponent {

}
