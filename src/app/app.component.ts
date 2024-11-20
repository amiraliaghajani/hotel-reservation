
import { Component, computed, effect, EventEmitter, inject, Output, signal } from '@angular/core';
import { CustomSidenavComponent } from './navagation/custom-sidenav/custom-sidenav.component';

import { Router, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router'
import { HeaderComponent } from './navagation/header/header.component';
import { SidenavListComponent } from './navagation/sidenav-list/sidenav-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';



import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { UserType } from './interface/user-type';
import { GetUserService } from './services/get-user.service';
import { SignupService } from './services/signup.service';
import { UserDataService } from './services/login/user-data.service';
import { Store } from '@ngrx/store';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    FlexLayoutModule,
    RouterModule,
    MatListModule,
    CustomSidenavComponent
    
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hotel-reservation';
  collapsed = signal(true)
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  
  userService = inject(GetUserService)
  @Output() sidenavToggle = new EventEmitter
  currentUser!: UserType;
  userDataService = inject(UserDataService)
  isLoggedIn: boolean = false;
darkMode=signal(false);

setDarkMode = effect(() => {
  document.documentElement.classList.toggle('dark', this.darkMode())
})
  
  
constructor( private router:Router,){}  

  ngOnInit(): void {
const user = localStorage.getItem('currentUser');
this.currentUser = user ? JSON.parse(user) :null




this.userDataService.currentUser$.subscribe(
  user => {
    this.isLoggedIn = !!user;
    if (!user){
     this.router.navigate(['/login'])
console.log("no user was found")
    }
  }
)

  }

  onLogout(){
    this.userDataService.logoutUser()
     localStorage.removeItem('authToken');
     this.router.navigate(['/login'])
   }

}
