import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingSignalService {
private loadingDataSubjectForSelectedHotel = new BehaviorSubject<boolean>(true);
loading$ = this.loadingDataSubjectForSelectedHotel.asObservable();

private loadingSearchTable = new BehaviorSubject<boolean>(false);
loadingSearch$ = this.loadingSearchTable.asObservable();

private onLoginLoading = new BehaviorSubject<boolean>(false) 
onLogin$ = this.onLoginLoading.asObservable()

  constructor() { }

  setLoading(isLoading:boolean){
    this.loadingDataSubjectForSelectedHotel.next(isLoading)
  }

setSearchLoading(isLoading:boolean){
  this.loadingSearchTable.next(isLoading)
}

setOnLogin(isLoading:boolean){
  this.onLoginLoading.next(isLoading)
}


}
