import { Component, effect, EventEmitter, inject, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router'

import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { UserType } from '../../interface/user-type';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { GetUserService } from '../../services/get-user.service';
import { SignupService } from '../../services/signup.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import { UserDataService } from '../../services/login/user-data.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
    FlexLayoutModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  userDataService = inject(UserDataService)
  currentUser!: UserType;
userService = inject(GetUserService)
  @Output() sidenavToggle = new EventEmitter
  isLoggedIn: boolean = false;
darkMode=signal(false);

setDarkMode = effect(() => {
  document.documentElement.classList.toggle('dark', this.darkMode())
})
  
  
constructor( private router:Router){}  

  ngOnInit(): void {
const user = localStorage.getItem('currentUser');
this.currentUser = user ? JSON.parse(user) :null
this.userDataService.currentUser$.subscribe(
  user => {
    this.isLoggedIn = !!user;
    if ( !user){
    this.router.navigate(['/login'])
console.log("No User Is Logged in")
    }
  }
)

  }
  
  
    onToggleSidenav(){
  this.sidenavToggle.emit();
    }
  onLogout(){
   this.userDataService.logoutUser()
    localStorage.removeItem('authToken');
    this.router.navigate(['/login'])
  }
  
  
  }
  