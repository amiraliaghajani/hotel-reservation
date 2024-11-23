
import { Component, computed, effect, EventEmitter, inject, Output, signal } from '@angular/core';
import { CustomSidenavComponent } from './navagation/custom-sidenav/custom-sidenav.component';

import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { interval, Subscription, timer } from 'rxjs';




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
    CustomSidenavComponent,
    MatProgressBarModule,
    CommonModule
    
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hotel-reservation';
  collapsed = signal(true)
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  isLoading = false;
  progressValue = 0; // Initial progress value
  private progressInterval!: Subscription;
  userService = inject(GetUserService)
  @Output() sidenavToggle = new EventEmitter
  currentUser!: UserType;
  userDataService = inject(UserDataService)
  isLoggedIn: boolean = false;
darkMode=signal(false);

setDarkMode = effect(() => {
  document.documentElement.classList.toggle('dark', this.darkMode())
})
  
  
constructor( private router:Router,){
  this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      this.startLoading();
    } else if (
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      timer(300).subscribe(() => (this.isLoading = false));
    }
  });
}  

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

  startLoading() {
    this.isLoading = true;
    this.progressValue = 0;

    this.progressInterval = interval(50).subscribe(() => {
      if (this.progressValue < 95) {
        this.progressValue += 5;
      }
    });
  }

  stopLoading() {
    if (this.progressInterval) {
      this.progressInterval.unsubscribe();
    }
    this.progressValue = 100;

    setTimeout(() => {
      this.isLoading = false;
      this.progressValue = 0;
    }, 300); 
  }


  onLogout(){
    this.userDataService.logoutUser()
     localStorage.removeItem('authToken');
     this.router.navigate(['/login'])
   }

}
