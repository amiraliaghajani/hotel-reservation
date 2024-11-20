import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-button-box',
  standalone: true,
  imports: [
    MatButtonModule,
    
  ],
  templateUrl: './button-box.component.html',
  styleUrl: './button-box.component.css'
})
export class ButtonBoxComponent {

}
