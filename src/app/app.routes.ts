import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

import { authGuard } from './AuthGuards/auth.guard';
import { adminCheckGuard } from './AuthGuards/admin-check.guard';

import { WelcomeComponent } from './welcome/welcome.component';



export const routes: Routes = [
    { path: '', component: LoginComponent },
    {path:'login', component:LoginComponent},
    {path:'allhotel',loadComponent:() => import("./all-available-hotel/all-available-hotel.component").then(m => m.AllAvailableHotelComponent), canActivate:[authGuard]},
    { path: 'selected/:id', loadComponent:() => import("./all-available-hotel/selected-hotel/selected-hotel.component").then(m => m.SelectedHotelComponent) , canActivate:[authGuard]},
    { path: 'welcome', component: WelcomeComponent , canActivate:[authGuard]},
{path:'signup',loadComponent: () => import("./auth/signup/signup.component").then(m => m.SignupComponent), canActivate:[adminCheckGuard]},
{path:'search',loadComponent: ()=> import("./search/search.component").then(m => m.SearchComponent), canActivate:[authGuard]},
{ path: 'allcomment', loadComponent: () => import("./comment-section/pending-comment/pending-comment.component").then(m => m.PendingCommentComponent) , canActivate:[adminCheckGuard]},
{ path: 'pendingreservation', loadComponent: ()=> import("./search/all-pending-reservation-table/all-pending-reservation-table.component").then(m => m.AllPendingReservationTableComponent) , canActivate:[adminCheckGuard]},
{ path: 'test3', loadComponent: ()=> import("./test3/test3.component").then(m => m.Test3Component)},
{ path: 'test4',loadComponent: ()=> import("./test4/test4.component").then(m => m.Test4Component)},
{ path: 'test5',loadComponent: ()=> import("./test5/test5.component").then(m => m.Test5Component)},
{ path: 'calendar',loadComponent: ()=> import("./reservation-calendar/reservation-calendar.component").then(m => m.ReservationCalendarComponent)},
{path:'dashboard',loadComponent: ()=> import("./dashboard/dashboard.component").then(m => m.DashboardComponent)},
{path:'hotellist',loadComponent: ()=> import("./hotel-list-administration/hotel-list-administration.component").then(m => m.HotelListAdministrationComponent)},
{path:'hotellist/:id',loadComponent: ()=> import("./hotel-list-administration/edit-form-hotel/edit-form-hotel.component").then(m => m.EditFormHotelComponent)},
{path:'hotellist/newhotel',loadComponent: ()=> import("./hotel-list-administration/new-hotel-form/new-hotel-form.component").then(m => m.NewHotelFormComponent)},
{ path: '**', redirectTo: '' }




];
