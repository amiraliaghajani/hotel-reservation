import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-loading-card',
  standalone: true,
  imports: [
    MatCardModule,
  ],
  templateUrl: './loading-card.component.html',
  styleUrl: './loading-card.component.css'
})
export class LoadingCardComponent {

}
