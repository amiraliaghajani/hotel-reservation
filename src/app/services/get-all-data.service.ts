import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, delay, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { HotelProduct } from '../interface/hotel-product';
import { HttpClient } from '@angular/common/http';
import { UserType } from '../interface/user-type';
import { Reservation } from '../interface/reservation';
import { CalendarForm } from '../interface/calendar-form';
import { LoadingSignalService } from './UI/loading-signal.service';

@Injectable({
  providedIn: 'root'
})
export class GetAllDataService {

  private userDataSubject = new BehaviorSubject <UserType[]>([]);
userData$ = this.userDataSubject.asObservable();
  constructor(private http:HttpClient) { }

loadingSignalService = inject (LoadingSignalService)
  private hotelApiUrl = 'http://localhost:3003';
  private UserApiUrl = 'http://localhost:3001';
private reservationApiUrl = 'http://localhost:3004'
private calendarApiUrl = 'http://localhost:3005'

// =========its being used for my serach component=======================================

getUserWithObservable():Observable<UserType[]>{
  this.loadingSignalService.setSearchLoading(true);
  console.log('Fetching data from API...');
  return this.http.get<{DUMMY_Users:UserType[]}>(this.UserApiUrl).pipe(
    map( response => response.DUMMY_Users  || []),
    delay(1500),
    tap((data) => this.userDataSubject.next(data),

  ),tap(() => 
    this.loadingSignalService.setSearchLoading(false),
  
  )
  )
}
deleteUser(userId:number):Observable<void>{
return this.http.delete<void>(this.UserApiUrl + `/${userId}`).pipe(
  tap( () => {
    const updatedData = this.userDataSubject.value.filter( user => user.id !== userId);
    this.userDataSubject.next(updatedData);
  })
)
}






  fetchDataFromHotel(): Observable<HotelProduct[]> {
    return this.http.get<{ DUMMY_Users: HotelProduct[] }>(this.hotelApiUrl).pipe(
      map(data => {
        if (data.DUMMY_Users) {
          return data.DUMMY_Users; 
        } else {
          throw new Error('No DUMMY_Users found in the response');
        }
      }),
      catchError((error) => {
        console.error('Error fetching data from API', error);
        return throwError(error); // Propagate the error for handling in the component
      })
    );
  }
  getSpecificHotel(id: number): Observable<HotelProduct> {
    return this.http.get<HotelProduct>(`${this.hotelApiUrl}/${id}`);
  }


  updateHotel(hotel: HotelProduct): Observable<HotelProduct> {
    return this.http.put<HotelProduct>(`${this.hotelApiUrl}/${hotel.id}`, hotel);
  }



  getUsers(): Observable<UserType[]> {
    return this.http.get<{ DUMMY_Users: UserType[] }>(this.UserApiUrl).pipe(
      map(data => {
        if (data.DUMMY_Users) {
          return data.DUMMY_Users; 
        } else {
          throw new Error('No DUMMY_Users found in the response');
        }
      }),
      catchError((error) => {
        console.error('Error fetching data from API', error);
        return throwError(error); // Propagate the error for handling in the component
      })
    );
  }

getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.reservationApiUrl);
  }
getCalendar(): Observable<CalendarForm[]> {
    return this.http.get<CalendarForm[]>(this.calendarApiUrl);
  }

  updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.get<Reservation[]>(this.reservationApiUrl).pipe(
      map(response => {
        const index = response.findIndex(c => c.reservationId === reservation.reservationId);
        if (index !== -1) {
          response[index] = reservation;
  
          return this.http.put(`${this.reservationApiUrl}/${reservation.reservationId}`, {response});
        } else {
          throw new Error('Comment not found');
        }
      }),
      switchMap(() => of(reservation))
    );
  }





  getMatchingUsers(): Observable<UserType[]> {
    return this.getUsers().pipe(
      switchMap(users =>
        this.getReservations().pipe(
          map(reservations =>
            users.filter(user =>
              reservations.some(reservation => reservation.user?.id === user.id)
            )
          ),
          catchError(error => {
            console.error('Error fetching reservations:', error);
            return of([]); 
          })
        )
      ),
      catchError(error => {
        console.error('Error fetching users:', error);
        return of([]);
      })
    );
  }
}
