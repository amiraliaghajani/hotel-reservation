import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { UserDataService } from '../../../services/login/user-data.service';
import { Router } from '@angular/router';

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
  userDataService= inject(UserDataService)
constructor(private router:Router){}

  onLogout(){
    this.userDataService.logoutUser()
     localStorage.removeItem('authToken');
     this.router.navigate(['/login'])
   }

}
