import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HotelProduct } from '../interface/hotel-product';
import { BehaviorSubject, catchError, delay, map, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingSignalService } from '../services/UI/loading-signal.service';



@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = 'http://localhost:3007';
loadingSignalService = inject(LoadingSignalService)


  products: HotelProduct[] = []
  filteredProducts: HotelProduct[] = []


  constructor(private http: HttpClient, private router: Router) { }


  getAllProducts(): Observable<HotelProduct[]> {
    this.loadingSignalService.setLoading(true);
    return this.http.get<HotelProduct[]>(this.apiUrl).pipe(
      tap(() =>  this.loadingSignalService.setLoading(false)),
      catchError(error => {
        console.error('Error fetching hotels:', error);
        return throwError(error);
      }));
     
  }
  fetchDataFromApi(): Observable<HotelProduct[]> {
    this.loadingSignalService.setLoading(true);
    return this.http.get<{ DUMMY_Users: HotelProduct[] }>(this.apiUrl).pipe(
      delay(1000),
      map(data => {
        if (data.DUMMY_Users) {
          return data.DUMMY_Users; 
          
        } else {
          throw new Error('No DUMMY_Users found in the response');
        }
      }),tap(() => this.loadingSignalService.setLoading(false)),
      catchError((error) => {
        console.error('Error fetching data from API', error);
        return throwError(error);
      })
    );
  }
}
