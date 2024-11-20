import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

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
export class ProfileInfoComponent {
  users = [
    { name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', profilePicture: 'https://via.placeholder.com/150' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'User', profilePicture: 'https://via.placeholder.com/150' },
    { name: 'Charlie Lee', email: 'charlie@example.com', role: 'Moderator', profilePicture: 'https://via.placeholder.com/150' },
  ];
}
