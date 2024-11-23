import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { UserType } from '../../../interface/user-type';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule

  ],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent implements OnInit {
  currentUser: UserType|null =null
  ngOnInit(){
const user = localStorage.getItem('currentUser');
this.currentUser = user ? JSON.parse(user) : null;
  }
}
