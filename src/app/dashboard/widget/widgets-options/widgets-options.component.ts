import { Component, inject, input, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { Widget } from '../../../interface/widget';
import { DashboardComponent } from '../../dashboard.component';
import { DashboardService } from '../../../services/dashboard.service';
@Component({
  selector: 'app-widgets-options',
  standalone: true,
  imports: [
    MatIcon,
    MatButtonModule,
    MatButtonToggleModule
  ],
  templateUrl: './widgets-options.component.html',
  styleUrl: './widgets-options.component.css',
  styles: [
    `
    :host{
    position: absolute;
    z-index: 99;
    color: black;
    top: 0;
    left: 0;
    border-radius: inherit;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    box-sizing: border-box;
    
   > div{
display: flex;
gap: 8px;
align-items: center;
margin-bottom: 8px;
}
}

.close-button{
    position: absolute;
    top: 0;
    right: 0;
}
    
    `
  ]
})
export class WidgetsOptionsComponent {
  data = input.required<Widget>();
showOptions=model<boolean>(false);
store =inject(DashboardService);


}
