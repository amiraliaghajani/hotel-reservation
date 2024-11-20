import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { WidgetComponent } from './widget/widget.component';
import { DashboardService } from '../services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { Widget } from '../interface/widget';
import {wrapGrid} from 'animate-css-grid'
import { UserType } from '../interface/user-type';
import { UserDataService } from '../services/login/user-data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    WidgetComponent,
    MatButtonModule,
    MatIcon,
    MatMenuModule,

  ],
  providers:[
DashboardService,

  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
store = inject(DashboardService)
dashboard = viewChild.required<ElementRef>('dashboard');
currentUser!: UserType;
  userDataService = inject(UserDataService)
  isLoggedIn: boolean = false;
constructor(private router:Router){}


ngOnInit(){
  wrapGrid(this.dashboard().nativeElement,{duration:300});
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
 
}
