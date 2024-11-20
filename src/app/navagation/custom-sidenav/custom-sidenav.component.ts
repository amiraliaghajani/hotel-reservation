import { Component, computed, inject, Input, signal } from '@angular/core';
import {MatListModule} from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'
import {MatTooltipModule} from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { UserType } from '../../interface/user-type';
import { UserDataService } from '../../services/login/user-data.service';

export type MenuItem = {
  icon: string;
  label:string;
  route:string;
}


@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    MatTooltipModule

  ],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.css'
})
export class CustomSidenavComponent {
menuItems = signal<MenuItem[]>([
{icon: 'person_add',
label: 'ثبت کاربر جدید',
route: 'signup',},

{icon: 'arrow_downward',
label: 'ورود',
route: 'login',},

{icon: 'search',
label: 'جستجوی اعضا',
route: 'search',},



{icon: 'shopping_cart',
label: 'مشاهده تمام هتل ها',
route: 'allhotel',},

{icon: 'comment',
label: 'کامنت های ثبت شده',
route: 'allcomment',},

{icon: 'event_available',
label: 'تقویم رزرو های ثبت شده',
route: 'calendar',},

{icon: 'list_alt',
label: 'رزور های ثبت شده',
route: 'pendingreservation',},

{icon: 'analytics',
label: 'داشبورد',
route: 'dashboard',},
]);

showDelay = new FormControl(500);
sideNavCollapsed = signal(false);
public userDataService = inject(UserDataService)
@Input() set collapsed(val : boolean){
  this.sideNavCollapsed.set(val)
}
profilePicSize = computed(() => this.sideNavCollapsed() ? '32' : '100')
currentUser!: UserType | null;
ngOnInit(){
  this.userDataService.currentUser$.subscribe(user => {
    this.currentUser = user
    console.log('updated current user to:', user)
  })

}  

}
