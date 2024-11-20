import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router'


import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { FlexLayoutModule } from '@angular/flex-layout';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-sidenav-list',
  standalone: true,
  imports: [   MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    FlexLayoutModule],
  templateUrl: './sidenav-list.component.html',
  styleUrl: './sidenav-list.component.css'
})
export class SidenavListComponent implements OnDestroy{
  @Output() toggleWindow = new EventEmitter
  isAuth=false
  subscription!: Subscription
  

  
   
  

 
  
  

  
  onClose():void{
    this.toggleWindow.emit()
  }
  
  onLogout(){
    this.onClose()
    
  }
  
  
  ngOnDestroy(): void {
  this.subscription.unsubscribe()
  
  }
  }
  