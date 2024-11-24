import { Component,inject,OnDestroy,OnInit, ViewChild, ViewEncapsulation  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserType } from '../interface/user-type';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClientModule here
import { Observable, Subscription } from 'rxjs';
import { DialogConfrimComponent } from '../dialog/dialog-confrim/dialog-confrim.component';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SignupService } from '../services/signup.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { GetAllDataService } from '../services/get-all-data.service';
import { MatPaginator } from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoadingSignalService } from '../services/UI/loading-signal.service';
import { LoadingSearchTabkeComponent } from '../dialog/loading-search-tabke/loading-search-tabke.component';






@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSortModule,
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatPaginator,
    MatProgressSpinnerModule,
    LoadingSearchTabkeComponent
    
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',

})
export class SearchComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['number', 
                              'persianFirstName', 
                               'persianLastName',
                                  'emailAddress', 
                                  'phoneNumber',
                                  'unit',
                                  'actions',
                                  ];
  dataSource = new MatTableDataSource<UserType>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  editIndex: number | null = null;
  originalUserData: UserType| null=null;
  selectedUser: UserType | null = null;

  user:UserType[]=[];
  isEditing: boolean = false;

 private getAllDataService = inject(GetAllDataService)
allUserAsObservable$: Observable<UserType[]> = this.getAllDataService.userData$;
loading: boolean = true;
private dataSubscription: Subscription | null = null;
loadingSignalService= inject(LoadingSignalService)
isLoading$ : Observable<boolean>;

  constructor(private http: HttpClient,
    private signupService:SignupService,
     public dialog: MatDialog
  ) {
    this.isLoading$ = this.loadingSignalService.loadingSearch$
  }



  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSubscription = this.getAllDataService.getUserWithObservable().subscribe({
      next: (data) => {
        console.log('Fetched data:', data);
        this.loading =false
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    })
    this.allUserAsObservable$.subscribe((data) => {
      this.dataSource.data = data
      this.dataSource.paginator = this.paginator;
    })
  }

  // fetchDataFromApi(): void {
  //   const apiUrl = 'http://localhost:3001'; 
  
  //   this.http.get<{ DUMMY_Users: UserType[] }>(apiUrl).subscribe(
  //     (data) => {
  //       console.log('Fetched Data:', data); 
  //       if (data.DUMMY_Users) {
  //         this.dataSource.data = data.DUMMY_Users;
  //         this.user = data.DUMMY_Users;
  //         console.log(this.user)
  //       } else {
  //         console.error('No DUMMY_Users found in the response');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching data from API', error);
  //     }
  //   );
  // }





  onRowClick(user: UserType): void {
    this.selectedUser = user; 
    this.originalUserData = { ...user };
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sortData(sortDirection: string) {
    if (sortDirection === 'asc') {
      this.dataSource.data.sort((a, b) => a.englishFirstName.localeCompare(b.englishFirstName));
    } else {
      this.dataSource.data.sort((a, b) => b.englishFirstName.localeCompare(a.englishFirstName));
    }
    this.dataSource._updateChangeSubscription(); // refresh the data source
  }

 
  // onSave(element: UserType): void {
  //   const apiUrl = `http://localhost:3001/${element.id}`;
  //   this.http.put<UserType>(apiUrl, element).subscribe(
  //     () => {
  //       this.editIndex = null; 
  //       this.fetchDataFromApi();
  //     },
  //     (error) => {
  //       console.error('Error updating user', error);
  //     }
  //   );
  // }

  selectRow(row: UserType): void {
    this.signupService.setUserId(row.id);
  }
  toggleEdit(): void {
    this.isEditing = !this.isEditing; // Toggle the edit mode
    
  }
  resetData(): void {
    if (this.originalUserData && this.selectedUser) {
      this.selectedUser.emailAddress = this.originalUserData.emailAddress;
      this.selectedUser.phoneNumber = this.originalUserData.phoneNumber;
      this.selectedUser.internalPhoneNumber = this.originalUserData.internalPhoneNumber;
      this.selectedUser.grade = this.originalUserData.grade;
      this.selectedUser.unit = this.originalUserData.unit;
      this.selectedUser.accessType = this.originalUserData.accessType;
    }
    this.isEditing = false;
  }

  onSubmit(): void {
    console.log('User updated:', this.selectedUser);
    this.isEditing = false; 
  }


  deleteUser(user: UserType): void {
    const dialogRef = this.dialog.open(DialogConfrimComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.getAllDataService.deleteUser(user.id).subscribe(
        () => {console.log("User deleted :", user);
          window.location.reload();
        },
        (error) => console.error("error deleting user : " , error),
        
       )
      }
    });
  }


  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }




}
